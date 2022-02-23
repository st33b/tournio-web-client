// The top-level page for bowlers
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";

import {apiHost} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";
import {tournamentDetailsRetrieved} from "../../store/actions/registrationActions";

const page = () => {
  const router = useRouter();
  const { dispatch } = useRegistrationContext();
  const { identifier } = router.query;

  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(null);

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
        setTournament(response.data);
        dispatch(tournamentDetailsRetrieved(response.data));
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        // Display some kind of error message
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

  return <TournamentDetails tournament={tournament} />;
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;