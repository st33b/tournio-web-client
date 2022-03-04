import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import TeamDetails from "../../../components/Director/TeamDetails/TeamDetails";
import {apiHost} from "../../../utils";

const page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();

  let {identifier} = router.query;

  if (!directorContext) {
    return '';
  }

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    if (!identifier) {
      return;
    }
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
    const tournament = directorContext.tournament;
    if (!directorContext.user.tournaments.some(t => t.identifier === tournament.identifier)) {
      router.push('/director');
    }

    const requestConfig = {
      method: 'get',
      url: `${apiHost}/director/teams/${identifier}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      },
    }
    axios(requestConfig)
      .then(response => {
        setTeam(response.data);
        setLoading(false);
      })
      .catch(error => {
        setErrorMessage(error);
      })
  }, [identifier]);

  if (loading) {
    return <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>;
  }
  if (errorMessage) {
    return (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          <strong>
            Oh no!
          </strong>
          {' '}{errorMessage}
        </div>
      </div>
    );
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: directorContext.tournament.name, path: `/director/tournaments/${directorContext.tournament.identifier}`},
    {text: 'Teams', path: `/director/tournaments/${directorContext.tournament.identifier}/teams`},
  ];

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={team.name} />
      <TeamDetails />
    </div>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default page;