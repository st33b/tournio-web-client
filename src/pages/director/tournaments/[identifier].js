import {useRouter} from "next/router";
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import {directorApiDownloadRequest, directorApiRequest, useModernTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../components/common/ErrorAlert";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout";
import ActiveTournament from "../../../components/Director/ActiveTournament/ActiveTournament";
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";

const Tournament = () => {
  const router = useRouter();
  const {identifier, stripe} = router.query;

  const {authToken} = useLoginContext();
  // const {loading, tournament, error, tournamentUpdated} = useTournament();
  const {loading, tournament, error, tournamentUpdated, tournamentUpdatedQuietly} = useModernTournament();

  // @admin -- should this break out into distinct functions?
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

  const downloadClicked = (path, onSuccess, onFailure) => {
    const uri = `/tournaments/${tournament.identifier}/${path}`;
    directorApiDownloadRequest({
      uri: uri,
      authToken: authToken,
      onSuccess: onSuccess,
      onFailure: onFailure,
    });
  }

  // -----------------

  if (loading) {
    return <LoadingMessage message={'Retrieving tournament details...'}/>;
  }

  if (!tournament) {
    return <LoadingMessage message={'Loading tournament details...'}/>;
  }

  const isFinalized = tournament.state === 'active' || tournament.state === 'closed';

  return (
    <div>
      <ErrorAlert message={error} className={``} />

      {isFinalized && (
        // <VisibleTournament closeTournament={stateChangeInitiated}/>
        <ActiveTournament tournament={tournament}
                          onDownloadClicked={downloadClicked}
        />
      )}
      {!isFinalized && (
        <TournamentInPrep requestStripeStatus={stripe}
                          stateChangeInitiated={stateChangeInitiated}
        />
      )}
    </div>
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
