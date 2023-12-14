import {useRouter} from "next/router";
import {directorApiRequest, useDirectorApi, useTournament} from "../../../../../../director";
import DirectorLayout from "../../../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useEffect, useState} from "react";
import ErrorBoundary from "../../../../../../components/common/ErrorBoundary";
import LoadingMessage from "../../../../../../components/ui/LoadingMessage/LoadingMessage";
import Breadcrumbs from "../../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import ErrorAlert from "../../../../../../components/common/ErrorAlert";
import PositionChooser from "../../../../../../components/common/formElements/PositionChooser/PositionChooser";
import BowlerForm from "../../../../../../components/Registration/BowlerForm/BowlerForm";
import {useLoginContext} from "../../../../../../store/LoginContext";
import {devConsoleLog} from "../../../../../../utils";

const Page = () => {
  const router = useRouter();
  const {identifier: tournamentId, teamId} = router.query;
  const {authToken} = useLoginContext();

  const {loading: tournamentLoading, tournament} = useTournament();
  const {loading: teamLoading, data: team, error: teamError, onDataUpdate: teamChanged} = useDirectorApi({
    uri: teamId ? `/teams/${teamId}` : null,
  });

  const [chosenPosition, choosePosition] = useState();
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [bowlerData, setBowlerData] = useState(null);

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

    const postData = convertBowlerDataForPost(bowlerDeets);

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

  // @refactor This is virtually identical to what's on the registration side.
  // The difference is getting through the additional questions.
  // (On registration, they're indexed by name; on director, they're an array.)
  const convertBowlerDataForPost = (bowlerData) => {
    devConsoleLog("Bowler data:", bowlerData);
    return {
      person_attributes: {
        first_name: bowlerData.first_name,
        last_name: bowlerData.last_name,
        usbc_id: bowlerData.usbc_id,
        birth_month: bowlerData.birth_month,
        birth_day: bowlerData.birth_day,
        nickname: bowlerData.nickname,
        phone: bowlerData.phone,
        email: bowlerData.email,
        address1: bowlerData.address1,
        address2: bowlerData.address2,
        city: bowlerData.city,
        state: bowlerData.state,
        country: bowlerData.country,
        postal_code: bowlerData.postal_code,
      },
      additional_question_responses: convertAdditionalQuestionResponsesForPost(bowlerData),
    };
  }

  const convertAdditionalQuestionResponsesForPost = (bowlerData) => {
    const responses = [];
    for (const questionKey in tournament.additional_questions) {
      responses.push({
        name: questionKey,
        response: bowlerData[questionKey] || '',
      });
    }
    return responses;
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
