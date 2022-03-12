import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {directorApiRequest} from "../../../utils";
import {useDirectorContext} from '../../../store/DirectorContext';
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentDetails from '../../../components/Director/TournamentDetails/TournamentDetails';

const tournament = () => {
  const directorContext = useDirectorContext();
  const router = useRouter();
  const { identifier } = router.query;

  useEffect(() => {
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const onTournamentFetchSuccess = (data) => {
    directorContext.setTournament(data);
  }

  const onTournamentFetchFailure = (data) => {
    setErrorMessage(data.error);
  }

  useEffect(() => {
    if (!directorContext.user) {
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
  }, [identifier]);

  const stateChangeSuccess = (data) => {
    directorContext.setTournament(data);
    setErrorMessage('Just making sure this works...');
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


  return (
    <div>
      {error}
      <TournamentDetails stateChangeInitiated={stateChangeInitiated}
                         testEnvironmentUpdated={testEnvironmentUpdated} />
    </div>
  );
}

tournament.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default tournament;