import {useRouter} from "next/router";

import RegistrationLayout from "../../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../../../store/RegistrationContext";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import Link from "next/link";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import {submitAddBowler, useTeam} from "../../../../../utils";
import TournamentHeader from "../../../../../components/ui/TournamentHeader";
import BowlerSummary from "../../../../../components/Registration/ReviewEntries/BowlerSummary";
import {existingTeamBowlerSaved} from "../../../../../store/actions/registrationActions";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, teamIdentifier} = router.query;

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState();

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!registration || !teamIdentifier) {
      return;
    }
  }, [teamIdentifier, registration]);

  const {loading, team, error: fetchError, teamHasChanged } = useTeam(teamIdentifier);

  if (!registration || !registration.tournament || !registration.bowler) {
    return '';
  }

  if (loading) {
    return <LoadingMessage message={'Getting things ready...'}/>
  }
  if (!team) {
    return '';
  }

  if (fetchError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team.'}/>
      </div>
    );
  }

  ////////////////////////////////////////

  const addBowlerSuccess = (bowlerData) => {
    // add the bowler to the team's bowlers, then call teamHasChanged and dispatch.
    team.bowlers = team.bowlers.concat(bowlerData);
    teamHasChanged(team);
    dispatch(existingTeamBowlerSaved(team));
    setProcessing(false);
    router.push({
      pathname: '/tournaments/[identifier]/teams/[teamIdentifier]',
      query: {
        identifier: identifier,
        teamIdentifier: teamIdentifier,
        success: 2,
        chosen: registration.bowler.position,
      }
    });
  }

  const addBowlerFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const saveClicked = () => {
    // Write the bowler to the backend, with the single bowler.
    // Upon success, redirect to the team's page, which will
    // present its options.
    submitAddBowler({
      tournament: registration.tournament,
      team: team,
      bowler: registration.bowler,
      onSuccess: addBowlerSuccess,
      onFailure: addBowlerFailure,
    });
    setProcessing(true);
  }

  let doublesPartner = null;
  if (registration.bowler.doubles_partner) {
    doublesPartner = team.bowlers.find(({identifier}) => registration.bowler.doubles_partner);
  }

  return (
    <div>
      <TournamentHeader tournament={registration.tournament}/>

      <h2 className={`text-center`}>
        Review Bowler Details
      </h2>

      <hr/>

      <BowlerSummary bowler={registration.bowler} partner={doublesPartner} />

      <hr />

      {error && <ErrorAlert message={error}/> }

      <div className={`d-flex justify-content-between`}>
        <Link href={{
          pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/add-bowler',
          query: {
            identifier: identifier,
            teamIdentifier: teamIdentifier,
            edit: true,
          }
        }}
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

      {processing && <LoadingMessage message={'Submitting registration...'} />}
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
