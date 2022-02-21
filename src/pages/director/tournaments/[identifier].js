// The hub for a tournament's details

import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

import {useAuthContext} from '../../../store/AuthContext';
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import TournamentDetails from '../../../components/Director/TournamentDetails/TournamentDetails';

const tournament = () => {
  const authContext = useAuthContext();
  const router = useRouter();
  const { identifier } = router.query;

  useEffect(() => {
    if (!authContext.isLoggedIn) {
      router.push('/director/login');
    }
  });

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  let errorMessage = '';
  useEffect(() => {
    if (!authContext.user) {
      return;
    }
    if (identifier === undefined) {
      return;
    }

    // fetch the tournament details
    const theUrl = `http://localhost:5000/director/tournaments/${identifier}`;
    const requestConfig = {
      headers: {
        'Accept': 'application/json',
        'Authorization': authContext.token,
      },
    }
    axios.get(theUrl, requestConfig)
      .then(response => {
        const tournament = response.data;
        setTournament(tournament);
        setLoading(false);
      })
      .catch(error => {
        errorMessage = error;
        setLoading(false);
      });

  }, [identifier, authContext.token]);

  const stateChangeInitiated = (stateChangeAction) => {
    // fetch the tournament details
    const theUrl = `http://localhost:5000/director/tournaments/${identifier}/state_change`;
    const requestConfig = {
      url: theUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authContext.token,
      },
      data: {
        state_action: stateChangeAction,
      },
      method: 'post',
    }
    setLoading(true);
    axios(requestConfig)
      .then(response => {
        setTournament(response.data);
      })
      .catch(error => {
      });
  }

  return <TournamentDetails tournament={tournament}
                            stateChangeInitiated={stateChangeInitiated} />;
}

tournament.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default tournament;