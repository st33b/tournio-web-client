import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded} from "../../../store/actions/registrationActions";
import {devConsoleLog, useClientReady} from "../../../utils";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import PositionChooser from "../../../components/common/formElements/PositionChooser/PositionChooser";
import TournamentHeader from "../../../components/ui/TournamentHeader";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;

  const [chosenPosition, choosePosition] = useState(1);

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!identifier || !registration || !registration.tournament) {
      return;
    }
    if (!registration.tournament.registration_options.new_team) {
      router.push(`/tournaments/${identifier}`);
    }
    if (edit) {
      devConsoleLog("Edit is true.");
      choosePosition(registration.bowler.position);
    }
  }, [registration, edit]);

  const ready = useClientReady();
  if (!ready) {
    return (
      <div>
        <LoadingMessage message={'Getting the registration form ready'}/>
      </div>
    );
  }
  if (!registration.tournament) {
    return (
      <div>
        <LoadingMessage message={'Looking for the tournament...'}/>
        {/*<LoadingMessage message={'Getting the registration form ready'}/>*/}
      </div>
    );
  }

  const newBowlerAdded = (bowlerInfo) => {
    // put the chosen position into the bowler info
    const bowlerData = {
      ...bowlerInfo,
      position: chosenPosition,
    }

    dispatch(newTeamBowlerInfoAdded(bowlerData));

    router.push(`/tournaments/${identifier}/new-team-review`);
  }

  const positionChosen = (position) => {
    choosePosition(position);
  }

  const previousBowlerData = edit ? registration.bowler : null;
  devConsoleLog("Previous bowler data: ", previousBowlerData);

  return (
    <div>
      <TournamentHeader tournament={registration.tournament}/>

      <h2 className={`text-center`}>
        Team:&nbsp;
        <strong>
          {registration.team.name}
        </strong>
      </h2>

      <hr />

      <h3 className={`text-center`}>
        Add a Bowler
      </h3>

      <hr />

      <PositionChooser maxPosition={registration.tournament.team_size}
                       chosen={chosenPosition}
                       onChoose={positionChosen}/>

      <BowlerForm tournament={registration.tournament}
                  bowlerData={previousBowlerData}
                  bowlerInfoSaved={newBowlerAdded}/>

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
