import {useRouter} from "next/router";

import InformationLayout from "../../../../../components/Layout/InformationLayout/InformationLayout";
import {useRegistrationContext} from "../../../../../store/RegistrationContext";
import {useState} from "react";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import Link from "next/link";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import {devConsoleLog, submitAddBowler, useTeam, useTheTournament} from "../../../../../utils";
import TournamentHeader from "../../../../../components/ui/TournamentHeader";
import BowlerSummary from "../../../../../components/Registration/ReviewEntries/BowlerSummary";
import {existingTeamBowlerSaved} from "../../../../../store/actions/registrationActions";

const Page = () => {
  devConsoleLog("------------ page untouched in team restoration");
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, teamIdentifier} = router.query;

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState();

  const {loading, team, error: fetchError, teamHasChanged } = useTeam(teamIdentifier);
  const {tournament, error: tournamentError} = useTheTournament(identifier);

  if (!registration || !tournament || !registration.bowler) {
    return <LoadingMessage message={'Getting things ready...'}/>
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
  if (tournamentError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load tournament.'}/>
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
      tournament: tournament,
      team: team,
      bowler: registration.bowler,
      onSuccess: addBowlerSuccess,
      onFailure: addBowlerFailure,
    });
    setProcessing(true);
  }

  let doublesPartner = null;
  if (registration.bowler.doubles_partner) {
    doublesPartner = team.bowlers.find(bowler => registration.bowler.doubles_partner === bowler.identifier);
  }

  return (
    <div>
      <TournamentHeader tournament={tournament}/>

      <h2 className={`bg-primary-subtle py-3`}>
        Review Bowler Details
      </h2>

      <h4 className={``}>
        Team:&nbsp;
        <strong>
          {team.name}
        </strong>
      </h4>

      <hr/>

      <div className={''}>
        <BowlerSummary bowler={registration.bowler}
                       tournament={tournament}
                       partner={doublesPartner}/>

        <hr/>

        {error && <ErrorAlert message={error}/>}

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

        {processing && <LoadingMessage message={'Submitting registration...'}/>}
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <InformationLayout>
      {page}
    </InformationLayout>
  );
}

export default Page;
