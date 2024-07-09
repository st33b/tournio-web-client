import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded} from "../../../store/actions/registrationActions";
import {devConsoleLog, useTheTournament} from "../../../utils";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import Link from "next/link";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import Sidebar from "../../../components/Registration/Sidebar/Sidebar";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;

  const [bowlerData, setBowlerData] = useState();
  const [takenPositions, setTakenPositions] = useState([]);

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
    dispatch(newTeamBowlerInfoAdded(bowlerInfo));

    setTakenPositions(takenPositions.concat(bowlerInfo.position).sort());

    // If that's the last one, then move along!
    if (takenPositions.length === tournament.config.team_size) {
      router.push(`/tournaments/${identifier}/new-team-review`);
    }

    // Otherwise, we're good as we are.
  }

  // some guards
  if (!registration.team) {
    // This happens when we're starting over, as part of a re-render that happens before the redirection.
    return '';
  }

  // const positionChosen = (position) => {
  //   choosePosition(position);
  // }
  //
  // const previousBowlerData = edit ? registration.bowler : null;

  const titleText = edit ? 'Make Changes' : 'Add Bowler Details';
  const buttonText = edit ? 'Save Changes' : 'Next';

  let preferredShiftNames = [];
  if (registration.team.shiftIdentifiers) {
    preferredShiftNames = registration.team.shiftIdentifiers.map(identifier =>
      tournament.shifts.find(shift => shift.identifier === identifier).name
    );
  }

  return (
    <>
      <div className={'row d-flex d-md-none'}>
        <div className={'col-5'}>
          <TournamentLogo url={tournament.imageUrl} additionalClasses={'mb-2'}/>
        </div>
        <p className={'col-7 display-4 align-self-center'}>
          {titleText}
        </p>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-4'}>

          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
            <p className={'col display-5'}>
              {titleText}
            </p>
          </div>

          <Sidebar tournament={tournament}
                   teamName={registration.team.name}
                   bowlers={registration.team.bowlers}
                   shiftPreferences={preferredShiftNames}/>
        </div>

        <div className={'col-12 col-md-8'}>
          <ProgressIndicator completed={['team']} active={'bowlers'}/>
          <BowlerForm tournament={tournament}
                      takenPositions={takenPositions}
                      bowlerInfoSaved={newBowlerAdded}
                      bowlerData={bowlerData} // Update this for the editing case
                      nextButtonText={buttonText}/>
        </div>
      </div>
    </>
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
