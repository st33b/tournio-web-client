import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded} from "../../../store/actions/registrationActions";
import {devConsoleLog, useTheTournament} from "../../../utils";
import React, {useEffect, useState} from "react";
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
    if (registration.team) {
      const newTakenPositions = registration.team.bowlers.map(({position}) => position);
      setTakenPositions(newTakenPositions);
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

    const newTakenPositions = takenPositions.concat(bowlerInfo.position).sort();
    setTakenPositions(newTakenPositions);

    // If that's the last one, then move along!
    if (newTakenPositions.length === tournament.config.team_size) {
      router.push(`/tournaments/${identifier}/doubles-partners`);
    }

    // Otherwise, we're good as we are.
  }

  const finishedWithBowlersClicked = () => {
    // They've chosen not to fill the team up just yet, so let's move on
    if (tournament.events.some(({rosterType}) => rosterType === 'double')) {
      router.push(`/tournaments/${identifier}/doubles-partners`);
    } else {
      router.push(`/tournaments/${identifier}/new-team-review`);
    }
  }

  // some guards
  if (!registration.team) {
    // This happens when we're starting over, as part of a re-render that happens before the redirection.
    return '';
  }

  const titleText = edit ? 'Make Changes' : 'Add Bowler Details';
  const buttonText = edit ? 'Save Changes' : 'Save Bowler';

  let preferredShiftNames = [];
  if (registration.team.shiftIdentifiers) {
    preferredShiftNames = registration.team.shiftIdentifiers.map(identifier =>
      tournament.shifts.find(shift => shift.identifier === identifier).name
    );
  }

  return (
    <>
      <div className={'row d-flex d-md-none'}>
        <p className={'display-3'}>
          {tournament.abbreviation} {tournament.year}
        </p>
        <ProgressIndicator completed={['team']} active={'bowlers'}/>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-4'}>

          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
          </div>

          <Sidebar tournament={tournament}
                   teamName={registration.team.name}
                   bowlers={registration.team.bowlers}
                   shiftPreferences={preferredShiftNames}/>

          {takenPositions.length > 1 && (
            <div className={'text-end'}>
              <p className={'my-3'}>
                Finished with bowlers?
              </p>
              <p>
                <Link href={{
                  pathname: '/tournaments/[identifier]/doubles-partners',
                  query: {
                    identifier: identifier,
                  }
                }}
                      className={'btn btn-outline-success'}>
                  Next Step
                  <i className="bi bi-chevron-double-right ps-1" aria-hidden="true"/>
                </Link>
              </p>
            </div>
          )}

          <hr className={'d-md-none'}/>
        </div>

        <div className={'col-12 col-md-8'}>
          <div className={'d-none d-md-block'}>
            <ProgressIndicator completed={['team']} active={'bowlers'}/>
          </div>
          <p className={'d-md-none display-5'}>
            {titleText}
          </p>
          <p className={'d-none d-md-block display-6'}>
            {titleText}
          </p>
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
