import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";
import {directorApiRequest, useClientReady} from "../../../utils";
import {useDirectorContext} from '../../../store/DirectorContext';
import {tournamentDetailsRetrieved, tournamentStateChanged} from "../../../store/actions/directorActions";

const Tournament = () => {
  const directorContext = useDirectorContext();
  const directorState = directorContext.directorState;
  const dispatch = directorContext.dispatch;

  const router = useRouter();
  const { identifier, stripe } = router.query;

  const [errorMessage, setErrorMessage] = useState(null);

  const stateChangeInitiated = (stateChangeAction) => {
    const uri = `/director/tournaments/${identifier}/state_change`;
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        state_action: stateChangeAction,
      },
    }

    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: (data) => dispatch(tournamentStateChanged(data)),
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  useEffect(() => {
    if (!directorState) {
      return;
    }
    if (identifier === undefined) {
      return;
    }
    // Don't fetch the tournament details if we already have it in state.
    if (directorState.tournament && identifier === directorState.tournament.identifier) {
      return;
    }

    const uri = `/director/tournaments/${identifier}`;
    const requestConfig = {
      method: 'get',
    }

    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: (data) => dispatch(tournamentDetailsRetrieved(data)),
      onFailure: (data) => setErrorMessage(data.error),
    });
  }, [identifier, directorContext, router]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  if (!directorState || !directorState.tournament || !directorState.tournament.identifier) {
    return '';
  }

  let error = '';
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center my-3'} role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          {errorMessage}
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  aria-label="Close" />
        </div>
      </div>
    );
  }

  const tournamentView = directorState.tournament.state === 'active' || directorState.tournament.state === 'closed'
    ? <VisibleTournament closeTournament={stateChangeInitiated} />
    : <TournamentInPrep stateChangeInitiated={stateChangeInitiated}
                        requestStripeStatus={stripe}
    />;

  return (
    <div>
      {error}
      {tournamentView}
    </div>
  );
}

Tournament.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Tournament;