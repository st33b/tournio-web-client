import React, {useState} from "react";
import {useRouter} from "next/router";
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";
import {directorApiRequest, useDirectorApi} from "../../../director";
import {useDirectorContext} from '../../../store/DirectorContext';
import {
  tournamentDetailsRetrieved,
  tournamentStateChanged
} from "../../../store/actions/directorActions";
import {useLoginContext} from "../../../store/LoginContext";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../components/common/ErrorBoundary";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Tournament = () => {
  const router = useRouter();
  const {identifier, stripe} = router.query;

  const {dispatch} = useDirectorContext();
  const {authToken} = useLoginContext();
  const [errorMessage, setErrorMessage] = useState();

  //
  // fetch tournament details
  const {loading, data: tournament, onDataUpdate} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}` : null,
    onSuccess: (t) => dispatch(tournamentDetailsRetrieved(t)),
    onFailure: (err) => setErrorMessage(err.message),
  });

  // -----------------

  const stateChangeInitiated = (stateChangeAction) => {
    const uri = `/tournaments/${identifier}/state_change`;
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
      authToken: authToken,
      onSuccess: (data) => {
        dispatch(tournamentStateChanged(data));
        onDataUpdate(data);
      },
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving tournament details...'}/>;
  }

  return (
    <ErrorBoundary>
      <div>
        <ErrorAlert message={errorMessage}
                    className={``}
                    onClose={() => setErrorMessage(null)}
        />

        {tournament && (
          (tournament.state === 'active' || tournament.state === 'closed'
              ? <VisibleTournament tournament={tournament}
                                   closeTournament={stateChangeInitiated}/>
              : <TournamentInPrep tournament={tournament}
                                  stateChangeInitiated={stateChangeInitiated}
                                  requestStripeStatus={stripe}/>
          )
        )}
      </div>
    </ErrorBoundary>
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
