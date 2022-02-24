import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";

import {apiHost} from "../../utils";
import {useTournamentContext} from "../../store/TournamentContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import {teamDetailsRetrieved} from "../../store/actions/tournamentActions";

const page = () => {
  const router = useRouter();
  const { details, dispatch } = useTournamentContext();
  const { identifier } = router.query;

  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(null);

  // fetch the team details
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    if (details.team) {
      console.log("Getting team out of tournament context");
      setTeam(details.team);
    } else {
      console.log("Retrieving team deets from server");
      const requestConfig = {
        method: 'get',
        url: `${apiHost}/teams/${identifier}`,
        headers: {
          'Accept': 'application/json',
        }
      }
      axios(requestConfig)
        .then(response => {
          dispatch(teamDetailsRetrieved(response.data));
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          // Display some kind of error message
        });
    }
  }, [identifier]);

  if (loading) {
    return (
      <div>
        <p>
          Retrieving team details...
        </p>
      </div>
    );
  }

  if (!team) {
    return '';
  }

  return (
    <>
      <p>Team name: {team.name}</p>
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