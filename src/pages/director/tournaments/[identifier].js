import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {directorApiRequest} from "../../../utils";
import {useDirectorContext} from '../../../store/DirectorContext';
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentDetails from '../../../components/Director/TournamentDetails/TournamentDetails';
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import classes from "../../../components/Director/TournamentDetails/TournamentDetails.module.scss";
import VisibleTournament from "../../../components/Director/VisibleTournament/VisibleTournament";

const Tournament = () => {
  const directorContext = useDirectorContext();
  const router = useRouter();
  const { identifier, stripe } = router.query;

  const [errorMessage, setErrorMessage] = useState(null);
  const [tournament, setTournament] = useState(null);

  const onTournamentFetchSuccess = (data) => {
    directorContext.setTournament(data);
  }

  const onTournamentFetchFailure = (data) => {
    setErrorMessage(data.error);
  }

  useEffect(() => {
    if (!directorContext) {
      return;
    }
    if (identifier === undefined) {
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
      onSuccess: onTournamentFetchSuccess,
      onFailure: onTournamentFetchFailure,
    });
  }, [identifier, directorContext.user, router]);

  if (!directorContext || !directorContext.tournament) {
    return '';
  }

  const stateChangeSuccess = (data) => {
    directorContext.setTournament(data);
  }

  const stateChangeFailure = (data) => {
    setErrorMessage(data.error);
  }

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
      onSuccess: stateChangeSuccess,
      onFailure: stateChangeFailure,
    });
  }

  const testEnvUpdateSuccess = (data, onSuccess) => {
    const tournament = {...directorContext.tournament}
    tournament.testing_environment = data;
    directorContext.setTournament(tournament);
    onSuccess();
  }

  const testEnvUpdateFailure = (data) => {
    setErrorMessage(data.error);
  }

  const testEnvironmentUpdated = (testEnvFormData, onSuccess) => {
    const uri = `/director/tournaments/${identifier}/testing_environment`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        testing_environment: {
          conditions: testEnvFormData,
        },
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: (data) => testEnvUpdateSuccess(data, onSuccess),
      onFailure: testEnvUpdateFailure,
    });
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

  const tournamentView = directorContext.tournament.state === 'active' || directorContext.tournament.state === 'closed'
    ? <VisibleTournament closeTournament={stateChangeInitiated} />
    : <TournamentDetails stateChangeInitiated={stateChangeInitiated}
                         testEnvironmentUpdated={testEnvironmentUpdated} />;

  const ladder = [{ text: 'Tournaments', path: '/director' }];
  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={directorContext.tournament.name} className={classes.Breadcrumbs} />
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