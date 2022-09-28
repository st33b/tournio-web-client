import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";
import {devConsoleLog} from "../../../utils";
import {directorApiRequest, useLoggedIn} from "../../../director";
import {useDirectorContext} from '../../../store/DirectorContext';
import {
  bowlerListReset, bowlerListRetrieved, freeEntryListRetrieved, teamListRetrieved,
  tournamentDetailsRetrieved,
  tournamentStateChanged
} from "../../../store/actions/directorActions";

const Tournament = () => {
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

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
      context: context,
      onSuccess: (data) => dispatch(tournamentStateChanged(data)),
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  const retrieveBowlers = () => {
    devConsoleLog('retrieving list of bowlers for the tournament');
    const uri = `/director/tournaments/${identifier}/bowlers`;
    const requestConfig = {
      method: 'get',
      params: {
        include_details: true,
      },
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: (data) => dispatch(bowlerListRetrieved(data)),
      onFailure: (_) => setErrorMessage('Failed to retrieve bowlers.'),
    });
  }

  const retrieveTeams = () => {
    devConsoleLog('retrieving list of teams for the tournament');
    const uri = `/director/tournaments/${identifier}/teams`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: (data) => dispatch(teamListRetrieved(data)),
      onFailure: (_) => setErrorMessage('Failed to retrieve teams.'),
    });
  }

  const retrieveFreeEntries = () => {
    devConsoleLog('retrieving list of free entries for the tournament');
    const uri = `/director/tournaments/${identifier}/free_entries`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: (data) => dispatch(freeEntryListRetrieved(data)),
      onFailure: (_) => setErrorMessage('Failed to retrieve free entries'),
    });
  }

  // Retrieve the tournament details if we need to
  useEffect(() => {
    if (!directorState) {
      return;
    }
    if (identifier === undefined) {
      return;
    }

    // Don't fetch the tournament details if we already have it in state.
    if (directorState.tournament && identifier === directorState.tournament.identifier) {
      devConsoleLog("Tournament is already in context, not fetching it again");
      return;
    }

    const uri = `/director/tournaments/${identifier}`;
    const requestConfig = {
      method: 'get',
    }

    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: (data) => {
        dispatch(bowlerListReset());
        dispatch(tournamentDetailsRetrieved(data));
        retrieveBowlers();
        retrieveTeams();
        retrieveFreeEntries();
      },
      onFailure: (data) => {
        if (data.error === 'Not found') {
          setErrorMessage('Tournament not found');
        } else {
          setErrorMessage(data.error);
        }
      },
    });
  }, [identifier, directorState]);

  // Ensure we're logged in with appropriate permissions
  useEffect(() => {
    if (!directorState.tournament || !directorState.user) {
      return;
    }

    const currentTournamentIdentifier = directorState.tournament.identifier;

    if (directorState.user.role !== 'superuser' && !directorState.user.tournaments.some(t => t.identifier === currentTournamentIdentifier)) {
      router.push('/director');
    }
  }, [directorState.tournament, directorState.user]);

  // Make sure we're logged in
  const loggedInState = useLoggedIn();
  const ready = loggedInState >= 0;
  if (!ready) {
    return '';
  }
  if (!loggedInState) {
    router.push('/director/login');
  }
  if (!directorState) {
    return '';
  }

  let error = '';
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center my-3'} role={'alert'}>
        <i className={'bi-exclamation-triangle-fill pe-2'} aria-hidden={true} />
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

  let tournamentView = '';
  if (directorState.tournament) {
    tournamentView = directorState.tournament.state === 'active' || directorState.tournament.state === 'closed'
      ? <VisibleTournament closeTournament={stateChangeInitiated} />
      : <TournamentInPrep stateChangeInitiated={stateChangeInitiated}
                          requestStripeStatus={stripe}
      />;
  }

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