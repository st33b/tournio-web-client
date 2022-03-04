import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Card} from "react-bootstrap";
import axios from "axios";

import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import TeamListing from "../../../components/Director/TeamListing/TeamListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import NewTeamForm from "../../../components/Director/NewTeamForm/NewTeamForm";
import {apiHost} from "../../../utils";

import classes from "../../../components/Director/TeamListing/TeamListing.module.scss";

const page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);

  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }

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

    const requestConfig = {
      method: 'get',
      url: `${apiHost}/director/tournaments/${identifier}/teams`,
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      }
    }
    axios(requestConfig)
      .then(response => {
        setTeams(response.data);
        setLoading(false);
      })
      .catch(error => {
        setErrorMessage(error);
        setLoading(false);
      });
  }, [identifier]);

  const newTeamSubmitted = (teamName) => {
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': directorContext.token
      },
      url: `${apiHost}/director/tournaments/${identifier}/teams`,
      data: {
        team: {
          name: teamName,
        }
      }
    }
    axios(requestConfig)
      .then(response => {
        setSuccessMessage('New team created!');
        const newData = teams.splice(0);
        newData.push(response.data);
        setTeams(newData);
      })
      .catch(error => {
        setErrorMessage('Failed to create a new team. Why? ' + error);
      });
  }

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
      </div>
    );
  }

  const newTeam = (
    <Card className={classes.Card}>
      <Card.Header as={'h4'}>
        New Team
      </Card.Header>
      <Card.Body>
        <NewTeamForm submitted={newTeamSubmitted} />
        {success}
        {error}
      </Card.Body>
    </Card>
  );

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
      <Breadcrumbs ladder={ladder} activeText={'Teams'}/>
      <div className={'row'}>
        <div className={'order-2 order-md-1 col'}>
          <TeamListing teams={teams} />
        </div>
        <div className={'order-1 order-md-2 col-12 col-md-4'}>
          {newTeam}
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