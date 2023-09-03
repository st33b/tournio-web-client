import {useRegistrationContext} from "../../../../store/RegistrationContext";
import {useRouter} from "next/router";
import RegistrationLayout from "../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentHeader from "../../../../components/ui/TournamentHeader";
import {useEffect, useState} from "react";
import PositionChooser from "../../../../components/common/formElements/PositionChooser/PositionChooser";
import {devConsoleLog, updateObject, useTeam} from "../../../../utils";
import SuccessAlert from "../../../../components/common/SuccessAlert";
import RegisteredBowler from "../../../../components/Registration/RegisteredBowler/RegisteredBowler";
import AddBowler from "../../../../components/Registration/AddBowler/AddBowler";

import ErrorAlert from "../../../../components/common/ErrorAlert";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import PositionUnavailable from "../../../../components/Registration/PositionUnavailable/PositionUnavailable";

const Page = () => {
  const {registration} = useRegistrationContext();
  const router = useRouter();
  const {identifier, teamIdentifier, chosen, success} = router.query;

  const [state, setState] = useState({
    tournament: null,
    chosenPosition: 1,
    successMessage: null,
  });

  useEffect(() => {
    if (!registration) {
      return;
    }

    let updatedSuccessMsg = state.successMessage;
    switch (success) {
      case '1':
        updatedSuccessMsg = 'Team and bowler created.';
        break;
      case '2':
        updatedSuccessMsg = 'Bowler added to team.';
      default:
        break;
    }

    const chosenPosition = chosen ? parseInt(chosen) : state.chosenPosition;

    setState(updateObject(state, {
      tournament: registration.tournament,
      successMessage: updatedSuccessMsg,
      chosenPosition: chosenPosition,
    }));

  }, [registration.tournament, chosen, success]);

  const {loading, team, error: fetchError } = useTeam(teamIdentifier);

  if (!registration || !state.tournament || !team) {
    return '';
  }

  if (loading) {
    return (
      <div>
        <LoadingMessage message={'Loading the team'}/>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team.'}/>
      </div>
    );
  }

  //////////////////////////

  const positionChosen = (position) => {
    setState(updateObject(state, {
      chosenPosition: position,
    }));
  }

  const dropQueryParams = () => {
    router.replace(`/tournaments/${identifier}/teams/${teamIdentifier}`, null, {shallow: true});
  }

  const contentByPosition = Array(state.tournament.team_size);
  const bowlers = team.bowlers ? [...team.bowlers] : [];
  const noMoreOpenings = bowlers.length === team.initial_size;
  for (let i = 0; i < state.tournament.team_size; i++) {
    const currentPosition = i + 1;
    const bowler = bowlers.find(({position}) => position === currentPosition);
    let content = '';
    if (bowler) {
      content = <RegisteredBowler bowler={bowler}/>;
    } else if (noMoreOpenings) {
      content = <PositionUnavailable/>;
    } else {
      content = <AddBowler tournament={state.tournament}
                           team={team}
                           position={currentPosition}/>;
    }
    contentByPosition[i] = content;
  }

  return (
    <div>
      <TournamentHeader tournament={state.tournament}/>

      {state.successMessage && <SuccessAlert message={state.successMessage}
                                             onClose={dropQueryParams}
      />}

      <h3 className={'text-center'}>
        Team: <strong>{team.name}</strong>
      </h3>

      <hr />

    {/* URL */}

    {/* URL copy function */}

      <PositionChooser maxPosition={state.tournament.team_size}
                       chosen={state.chosenPosition}
                       onChoose={positionChosen}/>

      {contentByPosition[state.chosenPosition - 1]}
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;
