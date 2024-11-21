import {useRouter} from "next/router";
import TournamentInPrep from '../../../components/Director/TournamentInPrep/TournamentInPrep';
import {directorApiDownloadRequest, directorApiRequest, useModernTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../components/common/ErrorAlert";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout";
import ActiveTournament from "../../../components/Director/ActiveTournament/ActiveTournament";
import {devConsoleLog} from "../../../utils";

const Tournament = () => {
  const router = useRouter();
  const {identifier, stripe} = router.query;

  const {authToken} = useLoginContext();
  const {loading, tournament, error, tournamentUpdated, tournamentUpdatedQuietly} = useModernTournament();

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

  const deleteTournament = () => {
    const uri = `/tournaments/${identifier}`;
    const requestConfig = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: () => {
        router.push('/director/tournaments')
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

  const contactFormSubmitted = (contactData, onSuccess, onFailure) => {
    const isNewContact = contactData.identifier.length === 0;
    const uri = isNewContact ? `/tournaments/${tournament.identifier}/contacts` : `/contacts/${contactData.identifier}`;
    const requestConfig = {
      method: isNewContact ? 'post' : 'patch',
      data: {
        contact: {
          name: contactData.name,
          email: contactData.email,
          role: contactData.role,
          notify_on_registration: contactData.notifyOnRegistration,
          notify_on_payment: contactData.notifyOnPayment,
          notification_preference: contactData.notificationPreference,
        }
      }
    };
    const modifiedTournament = {...tournament};
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => {
        if (isNewContact) {
          modifiedTournament.contacts = tournament.contacts.concat(data);
        } else {
          const index = modifiedTournament.contacts.findIndex(({identifier}) => identifier === data.identifier);
          modifiedTournament.contacts[index] = data;
        }
        tournamentUpdatedQuietly(modifiedTournament);
        onSuccess(data);
      },
      onFailure: onFailure,
    });
  }

  const contactDeleted = (contactData, onSuccess, onFailure) => {
    const uri = `/contacts/${contactData.identifier}`;
    const requestConfig = {
      method: 'delete',
      data: {},
    };
    const modifiedTournament = {...tournament};
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => {
        modifiedTournament.contacts = modifiedTournament.contacts.filter(({identifier}) => identifier !== data.identifier);
        tournamentUpdatedQuietly(modifiedTournament);
        onSuccess(data);
      },
      onFailure: onFailure,
    });
  }

  const configItemToggled = (itemId, newValue) => {
    const uri = `/config_items/${itemId}`;
    const requestConfig = {
      method: 'patch',
      data: {
        config_item: {
          value: newValue,
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (changedConfigItem) => {
        const index = tournament.configItems.findIndex(({id}) => id === itemId);
        const changedTournament = {...tournament};
        changedTournament.configItems = [...tournament.configItems];
        changedTournament.configItems[index] = changedConfigItem;
        tournamentUpdatedQuietly(changedTournament);
      },
      // onFailure: (err) => {
      //   setErrorMessage(err.message)
      // },
    });
  }

  const tournamentAttributeChanged = (changeData) => {
    directorApiRequest({
      uri: `/tournaments/${tournament.identifier}`,
      requestConfig: {
        method: 'patch',
        data: {
          tournament: {
            ...changeData
          },
        },
      },
      authToken: authToken,
      onSuccess: (tournamentData) => tournamentUpdatedQuietly(tournamentData),
      onFailure: (error) => devConsoleLog("D'oh!", error),
    })
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
                          onCloseClicked={() => stateChangeInitiated('close')}
                          onDeleteClicked={deleteTournament}
                          onDownloadClicked={downloadClicked}
                          onContactSubmit={contactFormSubmitted}
                          onContactDelete={contactDeleted}
                          onConfigItemToggle={configItemToggled}
                          onAttributeChange={tournamentAttributeChanged}
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
