import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Card} from "react-bootstrap";
import axios from "axios";

import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import BowlerListing from "../../../components/Director/BowlerListing/BowlerListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import {apiHost} from "../../../utils";
import TeamListing from "../../../components/Director/TeamListing/TeamListing";

const page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [bowlers, setBowlers] = useState(null);
  const [loading, setLoading] = useState(true);

  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }

  // Ensure we're logged in, with appropriate permission
  useEffect(() => {
    if (!identifier) {
      return;
    }
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
    if (directorContext.user.role !== 'superuser' && !directorContext.user.tournaments.some(t => t.identifier === identifier)) {
      router.push('/director');
    }
  }, [identifier]);

  // Fetch the bowlers from the backend
  useEffect(() => {
    if (!identifier) {
      return;
    }

    const requestConfig = {
      method: 'get',
      url: `${apiHost}/director/tournaments/${identifier}/bowlers`,
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      }
    }
    axios(requestConfig)
      .then(response => {
        setBowlers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setErrorMessage(error);
        setLoading(false);
      });
  }, [identifier]);

  // Do we have a success query parameter?
  useEffect(() => {
    const {success} = router.query;
    if (success === 'deleted') {
      setSuccessMessage('The bowler has been removed.');
      router.replace(router.pathname, null, { shallow: true });
    }
  });

  let success = '';
  let error = '';
  if (successMessage) {
    success = (
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-check-circle-fill pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          <strong>
            Success!
          </strong>
          {' '}{successMessage}
        </div>
        <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"} />
      </div>
    );
  }
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          <strong>
            Oh no!
          </strong>
          {' '}{errorMessage}
        </div>
        <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"} />
      </div>
    );
  }

  const ladder = [{text: 'Tournaments', path: '/director'}];
  if (directorContext.tournament) {
    ladder.push({text: directorContext.tournament.name, path: `/director/tournaments/${identifier}`});
  }

  if (loading) {
    return (
      <div>
        <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={'Bowlers'}/>
      <div className={'row'}>
        <div className={'col-12'}>
          {success}
          {error}
          <BowlerListing bowlers={bowlers} />
        </div>
      </div>
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