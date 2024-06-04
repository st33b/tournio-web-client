import {useRouter} from "next/router";
import {directorApiRequest, useModernTournament, useTeam} from "../../../../../../director";
import DirectorLayout from "../../../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useState} from "react";
import ErrorBoundary from "../../../../../../components/common/ErrorBoundary";
import LoadingMessage from "../../../../../../components/ui/LoadingMessage/LoadingMessage";
import Breadcrumbs from "../../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import ErrorAlert from "../../../../../../components/common/ErrorAlert";
import PositionChooser from "../../../../../../components/common/formElements/PositionChooser/PositionChooser";
import BowlerForm from "../../../../../../components/Registration/BowlerForm/BowlerForm";
import {useLoginContext} from "../../../../../../store/LoginContext";
import {convertBowlerDataForPost} from "../../../../../../utils";

const Page = () => {
  const router = useRouter();
  const {identifier: tournamentId, teamId} = router.query;
  const {authToken} = useLoginContext();

  const {loading: tournamentLoading, tournament} = useModernTournament();
  const {loading: teamLoading, team, error: teamError} = useTeam();

  const [chosenPosition, choosePosition] = useState();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [bowlerData, setBowlerData] = useState(null);

  const anotherPositionClicked = (otherPosition) => {
    choosePosition(otherPosition);
  }

  const bowlerSubmitSuccess = (bowlerDeets) => {
    setProcessing(false);
    router.push({
      pathname: '/director/tournaments/[identifier]/teams/[teamId]',
      query: {
        identifier: tournamentId,
        teamId: teamId,
        successCode: 2,
      },
    });
  }

  const bowlerSubmitFailure = (error) => {
    setProcessing(false);
    setErrorMessage(error);
  }

  const formCompleted = (bowlerDeets) => {
    setProcessing(true);
    setBowlerData(bowlerDeets);

    const postData = convertBowlerDataForPost(tournament, bowlerDeets);

    const uri = `/tournaments/${tournamentId}/bowlers`;
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler: {
          ...postData,
          position: chosenPosition,
          team: {
            identifier: teamId,
          },
        },
      },
    }
    setProcessing(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: bowlerSubmitSuccess,
      onFailure: bowlerSubmitFailure,
    });
  }

  if (teamError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team.'}/>
      </div>
    );
  }

  if (teamLoading || !team) {
    return <LoadingMessage message={'Getting the team ready...'}/>
  }

  if (tournamentLoading || !tournament) {
    return <LoadingMessage message={'Retrieving bowler registration form...'}/>
  }

  if (processing) {
    return <LoadingMessage message={'Adding bowler...'}/>
  }

  const maxPosition = parseInt(tournament.teamSize);

  let chosen;
  const occupied = team.bowlers.map(({position}) => position);
  for (let i = 0; i < tournament.teamSize; i++) {
    if (occupied[i] !== i + 1) {
      // We've found the first unoccupied position
      chosen = i + 1;
      break;
    }
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: tournament.name, path: `/director/tournaments/${tournamentId}`},
    {text: 'Teams', path: `/director/tournaments/${tournamentId}/teams`},
    {text: team.name, path: `/director/tournaments/${tournamentId}/teams/${teamId}`},
  ];

  return (
    <ErrorBoundary>
      <Breadcrumbs ladder={ladder} activeText={'Add a Bowler'}/>

      <h2 className={`text-center`}>
        Team:&nbsp;
        <strong>
          {team.name}
        </strong>
      </h2>

      <hr />

      <h3 className={`text-center`}>
        Add a Bowler
      </h3>

      <hr />

      <PositionChooser maxPosition={maxPosition}
                       chosen={chosen}
                       onChoose={anotherPositionClicked}
                       disallowedPositions={occupied}
      />

      <hr />

      <BowlerForm tournament={tournament}
                  bowlerInfoSaved={formCompleted}
                  bowlerData={bowlerData}
                  nextButtonText={'Save Bowler'}
      />

      {errorMessage && <ErrorAlert message={errorMessage}
                                   onClose={() => setErrorMessage(null)} /> }

    </ErrorBoundary>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Page;
