import {useRegistrationContext} from "../../../../store/RegistrationContext";
import {useRouter} from "next/router";
import RegistrationLayout from "../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentHeader from "../../../../components/ui/TournamentHeader";
import {useEffect, useState} from "react";
import PositionChooser from "../../../../components/common/formElements/PositionChooser/PositionChooser";
import {devConsoleLog, updateObject} from "../../../../utils";
import SuccessAlert from "../../../../components/common/SuccessAlert";
import RegisteredBowler from "../../../../components/Registration/RegisteredBowler/RegisteredBowler";
import AddBowler from "../../../../components/Registration/AddBowler/AddBowler";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {chosen, success, error} = router.query;

  const [state, setState] = useState({
    tournament: null,
    team: null,
    chosenPosition: 1,
    errorMessage: null,
    successMessage: null,
  });

  useEffect(() => {
    if (!registration) {
      return;
    }

    // retrieve team (and tournament) if we need to
    if (!registration.team) {
      // fetch it
    }

    // switch (error) {
    //   case 1:
    //     // ...
    //   default:
    //     break;
    // }

    let updatedSuccessMsg = state.successMessage;
    switch (success) {
      case '1':
        updatedSuccessMsg = 'Team and bowler created.';
        break;
      default:
        break;
    }

    const chosenPosition = chosen ? parseInt(chosen) : state.chosenPosition;

    setState(updateObject(state, {
      tournament: registration.tournament,
      team: registration.team,
      successMessage: updatedSuccessMsg,
      chosenPosition: chosenPosition,
    }));

  }, [registration.tournament, registration.team, chosen, success, error]);

  if (!registration || !state.tournament || !state.team) {
    return '';
  }

  //////////////////////////

  const positionChosen = (position) => {
    setState(updateObject(state, {
      chosenPosition: position,
    }));
  }

  const contentByPosition = Array(state.tournament.team_size);
  const noMoreOpenings = state.team.bowlers.count === state.team.initial_size;
  for (let i = 0; i < state.tournament.team_size; i++) {
    const currentPosition = i + 1;
    const bowler = state.team.bowlers.find(({position}) => position === currentPosition);
    let content = '';
    if (bowler) {
      // Display minimal bowler data, plus pay/extras link
      content = <RegisteredBowler bowler={bowler}/>;
    } else if (noMoreOpenings) {
      // Display "position unavailable"
      content = (
        <p>
          Position unavailable
        </p>
      );
    } else {
      // Display "Add Info" link
      content = <AddBowler tournament={state.tournament} team={state.team}/>;
    }
    contentByPosition[i] = content;
  }

  return (
    <div>
      <TournamentHeader tournament={state.tournament}/>

      {state.successMessage && <SuccessAlert message={state.successMessage}/>}

      <h3 className={'text-center'}>
        Team: <strong>{state.team.name}</strong>
      </h3>

      <hr />

    {/* URL */}

    {/* URL copy function */}

    {/* TEAM FULL indicator if bowlers.count === initial_size */}

    {/* Position chooser */}
      <PositionChooser maxPosition={state.tournament.team_size}
                       chosen={state.chosenPosition}
                       onChoose={positionChosen}/>

      {contentByPosition[state.chosenPosition - 1]}
    {/* Display relevant thing for chosen position:
      *  Name of already-registered bowler, with link to payment/extra page
      *  "Add Info" for bowler in that position, if team isn't full
      *  Bowler Form for bowler in the chosen position, after clicking "Add Info"
      *  Review Bowler page after entering bowler data
      */}
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
