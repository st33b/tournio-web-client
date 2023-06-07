import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";
import {devConsoleLog} from "../../../utils";
import {directorApiRequest, makeAnApiCall, useDirectorApi, useLoggedIn} from "../../../director";
import {useDirectorContext} from '../../../store/DirectorContext';
import {
  tournamentDetailsRetrieved,
  tournamentStateChanged
} from "../../../store/actions/directorActions";
import {useLoginContext} from "../../../store/LoginContext";
import ErrorPage from "../../../components/ui/ErrorAlert";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../components/common/ErrorBoundary";

const Tournament = () => {
  const router = useRouter();
  const { identifier, stripe } = router.query;
  const { dispatch } = useDirectorContext();
  const {ready, user, authToken} = useLoginContext();
  const [errorMessage, setErrorMessage] = useState();

  //
  // fetch tournament details
  const { loading, data: tournament } = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}` : null,
    onSuccess: (t) => dispatch(tournamentDetailsRetrieved(t)),
    onFailure: (err) => setErrorMessage(err.message),
  });

  // -----------------

  if (!ready) {
    return '';
  }

  // @hooks_todo Convert this to use useDirectorApi once it has support for POST requests
  const stateChangeInitiated = (stateChangeAction) => {
    const uri = `/tournaments/${identifier}/state_change`;
    const requestConfig = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        state_action: stateChangeAction,
      },
    }

    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      onSuccess: (data) => dispatch(tournamentStateChanged(data)),
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving tournament details'} />;
  }

  return (
    <div>
      <ErrorBoundary>
        <ErrorPage text={errorMessage}/>

        {tournament && (
          (tournament.state === 'active' || tournament.state === 'closed'
              ? <VisibleTournament closeTournament={stateChangeInitiated} />
              : <TournamentInPrep stateChangeInitiated={stateChangeInitiated}
                                  requestStripeStatus={stripe} />
          )
        )}
      </ErrorBoundary>
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
