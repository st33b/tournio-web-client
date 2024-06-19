import {useEffect, useState} from "react";
import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {soloBowlerRegistrationCompleted} from "../../../store/actions/registrationActions";
import {submitSoloRegistration, useTheTournament} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../components/common/ErrorAlert";
import Link from "next/link";
import TournamentHeader from "../../../components/ui/TournamentHeader";
import BowlerSummary from "../../../components/Registration/ReviewEntries/BowlerSummary";
import ErrorBoundary from "../../../components/common/ErrorBoundary";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier} = router.query;

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const {loading, tournament, error: tournamentError} = useTheTournament(identifier);

  useEffect(() => {
    if (!identifier || !tournament) {
      return;
    }
    if (!tournament.registrationOptions.solo) {
      router.push(`/tournaments/${identifier}`);
    }
  }, [registration]);

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Putting everything together...'}/>
      </div>
    );
  }

  const soloRegistrationSuccess = (bowler) => {
    dispatch(soloBowlerRegistrationCompleted());
    setProcessing(false);
    router.push({
      pathname: '/bowlers/[identifier]',
      query: {
        identifier: bowler.identifier,
        success: 1,
      }
    })
  }

  const soloRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const saveClicked = () => {
    // Write the bowler to the backend.
    // Upon success, redirect to the bowler's page, which will
    // present its payment/extras button
    submitSoloRegistration(tournament,
      registration.bowler,
      soloRegistrationSuccess,
      soloRegistrationFailure);
    setProcessing(true);
  }

  return (
    <div>
      <TournamentHeader tournament={tournament}/>

      <h2 className={`bg-primary-subtle py-3`}>
        Review Bowler Details
      </h2>

      <hr/>

      <BowlerSummary bowler={registration.bowler} tournament={tournament} />

      <hr />

      {error && <ErrorAlert message={error}/> }
      {tournamentError && <ErrorAlert message={tournamentError}/> }

      <div className={`d-flex justify-content-between`}>
        <Link
          href={{
              pathname: '/tournaments/[identifier]/solo-bowler',
              query: {
                identifier: identifier
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
