// The hub for a tournament's details

import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

import {apiHost} from "../../../utils";
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

  const [loading, setLoading] = useState(true);
  let errorMessage = '';
  useEffect(() => {
    if (!directorContext.user) {
      return;
    }
    if (identifier === undefined) {
      return;
    }

    // fetch the tournament details
    const theUrl = `${apiHost}/director/tournaments/${identifier}`;
    const requestConfig = {
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      },
    }
    axios.get(theUrl, requestConfig)
      .then(response => {
        const tournament = response.data;
        directorContext.setTournament(tournament);
        setLoading(false);
      })
      .catch(error => {
        if (error.response.status === 401) {
          directorContext.logout();
          router.push('/director/login');
        }
        errorMessage = error;
        setLoading(false);
      });

  }, [identifier, directorContext.token]);

  const stateChangeInitiated = (stateChangeAction) => {
    // fetch the tournament details
    const theUrl = `${apiHost}/director/tournaments/${identifier}/state_change`;
    const requestConfig = {
      url: theUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': directorContext.token,
      },
      data: {
        state_action: stateChangeAction,
      },
      method: 'post',
    }
    setLoading(true);
    axios(requestConfig)
      .then(response => {
        directorContext.setTournament(response.data);
      })
      .catch(error => {
        if (error.response.status === 401) {
          directorContext.logout();
          router.push('/director/login');
        }
      });
  }

  const testEnvironmentUpdated = (testEnvFormData, onSuccess) => {
    const requestConfig = {
      method: 'patch',
      url: `${apiHost}/director/tournaments/${identifier}/testing_environment`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': directorContext.token,
      },
      data: {
        testing_environment: {
          conditions: testEnvFormData,
        },
      },
    };
    axios(requestConfig)
      .then(response => {
        const tournament = {...directorContext.tournament}
        tournament.testing_environment = response.data;
        directorContext.setTournament(tournament);
        onSuccess();
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          directorContext.logout();
          router.push('/director/login');
        }
        console.log('Whoops');
        console.log(error);
      });
  }

  return <TournamentDetails stateChangeInitiated={stateChangeInitiated}
                            testEnvironmentUpdated={testEnvironmentUpdated} />;
}

tournament.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default tournament;