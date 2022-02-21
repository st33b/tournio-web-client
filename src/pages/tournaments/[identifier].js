// The top-level page for bowlers
import {useRouter} from "next/router";

import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useEffect, useState} from "react";
import axios from "axios";
import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";

const page = () => {
  const router = useRouter();
  const { identifier } = router.query;

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  let errorMessage = '';

  // fetch the tournament details
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    const requestConfig = {
      method: 'get',
      url: `http://localhost:5000/tournaments/${identifier}`,
      headers: {
        'Accept': 'application/json',
      }
    }

    axios(requestConfig)
      .then(response => {
        setTournament(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        errorMessage = 'Whoops!';
      });
  }, [identifier]);

  if (loading) {
    return (
      <div className={classes.TournamentDetails}>
        <p>
          Retrieving tournament details...
        </p>
      </div>
    );
  }

  return (
    <>
      <TournamentDetails tournament={tournament} />
      {errorMessage}
    </>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;