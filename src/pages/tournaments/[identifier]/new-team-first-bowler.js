import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded} from "../../../store/actions/registrationActions";
import {devConsoleLog, useTheTournament} from "../../../utils";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import PositionChooser from "../../../components/common/formElements/PositionChooser/PositionChooser";
import TournamentHeader from "../../../components/ui/TournamentHeader";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;

  const [chosenPosition, choosePosition] = useState(1);

  const {loading, tournament} = useTheTournament(identifier);

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!identifier || !tournament || !registration) {
      return;
    }
    if (!tournament.registrationOptions.new_team) {
      router.push(`/tournaments/${identifier}`);
    }
    if (edit) {
      devConsoleLog("Edit is true.");
      choosePosition(registration.bowler.position);
    }
  }, [edit, tournament, registration]);

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Looking for the tournament...'}/>
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

  return (
    <div className={'row'}>
      <div className={'col-12'}>
        <TournamentHeader tournament={tournament}/>

        <h2 className={`bg-primary-subtle py-3`}>
          First Bowler
        </h2>

        <h4 className={``}>
          Team:&nbsp;
          <strong>
            {registration.team.name}
          </strong>
        </h4>

      </div>

      <div className={'col-md-10 offset-md-1 col-lg-8 offset-lg-2'}>
        <PositionChooser maxPosition={tournament.teamSize}
                         chosen={chosenPosition}
                         onChoose={positionChosen}/>

        <BowlerForm tournament={tournament}
                    bowlerData={previousBowlerData}
                    bowlerInfoSaved={newBowlerAdded}/>

      </div>
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
