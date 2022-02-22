// The top-level page for bowlers
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";

import {apiHost} from "../../utils";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";

import {useRegistrationContext} from "../../store/RegistrationContext";

const page = () => {
  const router = useRouter();
  const { identifier } = router.query;

  const registrationContext = useRegistrationContext();

  const [loading, setLoading] = useState(true);
  let errorMessage = '';

  // fetch the tournament details and put the tournament into context
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
    axios(requestConfig)
      .then(response => {
        registrationContext.useTournament(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        errorMessage = 'Whoops!';
      });
  }, [identifier]);

  if (loading) {
    return (
      <div>
        <p>
          Retrieving tournament details...
        </p>
      </div>
    );
  }

  return <TournamentDetails />;
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;