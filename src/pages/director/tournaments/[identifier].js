import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";
import {devConsoleLog} from "../../../utils";
import {directorApiRequest, useDirectorApi, useLoggedIn} from "../../../director";
import {useDirectorContext} from '../../../store/DirectorContext';
import {
  tournamentDetailsRetrieved,
  tournamentStateChanged
} from "../../../store/actions/directorActions";
import {useLoginContext} from "../../../store/LoginContext";
import ErrorPage from "../../../components/ui/ErrorAlert";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Tournament = () => {
  const router = useRouter();
  const { identifier, stripe } = router.query;
  const context = useDirectorContext();
  const dispatch = context.dispatch;
  const {ready, user} = useLoginContext();

  ///////////////

  const { loading, data: tournament, error } = useDirectorApi({
    uri: `/tournaments/${identifier}`,
    requestConfig: {
      method: 'get',
    },
    onSuccess: (t) => dispatch(tournamentDetailsRetrieved(t)),
  });

  // -----------------

  if (!ready || !user) {
    return '';
  }

  // @hooks_todo Convert this to use useDirectorApi once it has support for POST requests
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

  if (loading) {
    return <LoadingMessage message={'Retrieving tournament details'} />;
  }

  return (
    <div>
      <ErrorPage text={error}/>

      {tournament && (
        (tournament.state === 'active' || tournament.state === 'closed'
          ? <VisibleTournament closeTournament={stateChangeInitiated} />
          : <TournamentInPrep stateChangeInitiated={stateChangeInitiated}
                              requestStripeStatus={stripe} />
        )
      )}
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
