import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";
import {directorApiRequest, useTournament} from "../../../director";
import {useDirectorContext} from '../../../store/DirectorContext';
import {
  tournamentDetailsRetrieved,
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

  const {loading, tournament, error, tournamentUpdated} = useTournament();

  // @swr-refactor -- won't need this anymore
  useEffect(() => {
    if (!tournament) {
      return;
    }
    dispatch(tournamentDetailsRetrieved(tournament));
  }, [tournament]);

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
        tournamentUpdated(data);
      },
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  // -----------------

  if (loading) {
    return <LoadingMessage message={'Retrieving tournament details...'}/>;
  }

  return (
    <ErrorBoundary>
      <div>
        <ErrorAlert message={error}
                    className={``}
        />

        {tournament && (
          (tournament.state === 'active' || tournament.state === 'closed'
              ? <VisibleTournament closeTournament={stateChangeInitiated}
                                   tournament={tournament}
              />
              : <TournamentInPrep requestStripeStatus={stripe}
                                  tournament={tournament}
                                  stateChangeInitiated={stateChangeInitiated}
              />
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
