// The top-level page for bowlers
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";

import {apiHost} from "../../utils";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";

import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";

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
      url: `${apiHost}/tournaments/${identifier}`,
      headers: {
        'Accept': 'application/json',
      }
    }
    console.log(requestConfig.url);
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