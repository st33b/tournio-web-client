import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {devConsoleLog, submitNewTeamWithPlaceholders, useTheTournament} from "../../../utils";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import NewTeamReview from "../../../components/Registration/NewTeamReview/NewTeamReview";
import Link from "next/link";
import {newTeamEntryCompleted} from "../../../store/actions/registrationActions";
import TournamentHeader from "../../../components/ui/TournamentHeader";

const Page = () => {
  devConsoleLog("------------ page untouched in team restoration");
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier} = router.query;

  const [processing, setProcessing] = useState(false);
  const {loading: tournamentLoading, tournament, error: tournamentError} = useTheTournament(identifier);

  // If new-team registrations isn't enabled, go back to the tournament home page
  useEffect(() => {
    if (!identifier || !registration || !tournament) {
      return;
    }
    if (!tournament.registrationOptions.new_team) {
      router.push(`/tournaments/${identifier}`);
    }
  }, [identifier, registration]);

  if (tournamentLoading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Putting everything together...'}/>
      </div>
    );
  }

  const newTeamRegistrationSuccess = (teamData) => {
    dispatch(newTeamEntryCompleted(teamData));
    setProcessing(false);
    router.push({
      pathname: '/tournaments/[identifier]/teams/[teamIdentifier]',
      query: {
        identifier: identifier,
        teamIdentifier: teamData.identifier,
      }
    });
  }

  const newTeamRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    if (errorMessage.team) {
      // back to team info
      router.push({
        pathname: '/tournaments/[identifier]/new-team',
        query: {
          identifier: identifier,
          message: 2,
        }
      });
    } else if (errorMessage.bowler) {
      // back to bowler info
      router.push({
        pathname: '/tournaments/[identifier]/new-team-first-bowler',
        query: {
          identifier: identifier,
          edit: true,
        }
      });
    }
  }

  const editBowlerClicked = () => {
    router.push(`/tournaments/${identifier}/new-team-first-bowler`);
  }

  const saveClicked = () => {
    // Write the team to the backend, with the single bowler.
    // Upon success, redirect to the team's page, which will
    // present its options.
    submitNewTeamWithPlaceholders({
      tournament: tournament,
      team: registration.team,
      bowler: registration.bowler,
      onSuccess: newTeamRegistrationSuccess,
      onFailure: newTeamRegistrationFailure,
    });
    setProcessing(true);
  }

  return (
    <div className={'row'}>
      <div className={'col-12'}>
        <TournamentHeader tournament={tournament}/>

        <h3 className={`bg-primary-subtle py-3`}>
          Initial Review
        </h3>

      </div>

      <div className={'col-md-10 offset-md-1 col-lg-8 offset-lg-2'}>
      <NewTeamReview team={registration.team}
                       bowler={registration.bowler}
                       tournament={tournament}
                       onEdit={editBowlerClicked}
                       onSave={saveClicked}/>

        <hr/>

        <div className={`d-flex justify-content-between`}>
          <Link href={`/tournaments/${identifier}/new-team-first-bowler?edit=true`}
                className={`btn btn-lg btn-outline-primary d-block ${processing && 'invisible'}`}>
            <i className={'bi bi-chevron-double-left pe-2'}
               aria-hidden={true}/>
            Make Changes
          </Link>

          <button className={`btn btn-lg btn-primary`}
                  disabled={processing}
                  onClick={saveClicked}>
            Save
            <i className={'bi bi-chevron-double-right ps-2'}
               aria-hidden={true}/>
          </button>
        </div>

        {processing && <LoadingMessage message={'Submitting registration...'}/>}
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
