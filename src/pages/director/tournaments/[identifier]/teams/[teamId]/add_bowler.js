import {useRouter} from "next/router";
import {useDirectorApi, useTournament} from "../../../../../../director";
import DirectorLayout from "../../../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useEffect, useState} from "react";
import ErrorBoundary from "../../../../../../components/common/ErrorBoundary";
import LoadingMessage from "../../../../../../components/ui/LoadingMessage/LoadingMessage";
import Breadcrumbs from "../../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import ErrorAlert from "../../../../../../components/common/ErrorAlert";
import PositionChooser from "../../../../../../components/common/formElements/PositionChooser/PositionChooser";
import BowlerForm from "../../../../../../components/Registration/BowlerForm/BowlerForm";

const Page = () => {
  const router = useRouter();
  const {identifier: tournamentId, teamId} = router.query;

  const {loading: tournamentLoading, tournament} = useTournament();
  const {loading: teamLoading, data: team, error: teamError, onDataUpdate: teamChanged} = useDirectorApi({
    uri: teamId ? `/teams/${teamId}` : null,
  });

  const [chosenPosition, choosePosition] = useState();
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [bowlerData, setBowlerData] = useState();

  useEffect(() => {
    if (!tournament || !team || chosenPosition > 0) {
      return;
    }
    const occupied = team.bowlers.map(({position}) => position).sort();
    for (let i = 0; i < parseInt(tournament.team_size); i++) {
      if (occupied[i] !== i + 1) {
        // We've found the first unoccupied position
        choosePosition(i + 1);
        setOccupiedPositions(occupied);
        break;
      }
    }
  }, [tournament, team]);

  const anotherPositionClicked = (otherPosition) => {
    choosePosition(otherPosition);
  }

  const bowlerSubmitSuccess = (bowlerDeets) => {
    const changedTeam = {
      ...team,
      bowlers: team.bowlers.concat(bowlerDeets),
    }
    setProcessing(false);
    teamChanged(changedTeam);
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

    // write the bowler data
    bowlerSubmitFailure('Not yet implemented.');
  }
  ////////////////////////////////////////////////////////////////////

  if (teamError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team.'}/>
      </div>
    );
  }

  if (tournamentLoading || teamLoading || !team) {
    return <LoadingMessage message={'Retrieving bowler registration form...'}/>
  }

  const maxPosition = parseInt(tournament.team_size);

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
                       chosen={chosenPosition}
                       onChoose={anotherPositionClicked}
                       disallowedPositions={occupiedPositions}
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
