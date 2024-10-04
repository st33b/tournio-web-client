import {useRouter} from "next/router";
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";
import {directorApiRequest, useTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../components/common/ErrorBoundary";
import ErrorAlert from "../../../components/common/ErrorAlert";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout";

const Tournament = () => {
  const router = useRouter();
  const {identifier, stripe} = router.query;

  const {authToken} = useLoginContext();
  const {loading, tournament, error, tournamentUpdated} = useTournament();

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
              ? <VisibleTournament closeTournament={stateChangeInitiated}/>
              : <TournamentInPrep requestStripeStatus={stripe}
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
    <AdminLayout>
      {page}
    </AdminLayout>
  );
}

export default Tournament;
