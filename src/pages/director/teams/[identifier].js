import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {Card, Button, Row, Col} from "react-bootstrap";

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

  // This effect ensures that we're logged in and have permission to administer the current tournament
  useEffect(() => {
    if (!directorContext || !directorContext.tournament || !directorContext.user) {
      return;
    }
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
    const tournament = directorContext.tournament;
    // if the logged-in user is a director but not for this tournament...
    if (directorContext.user.role === 'director' && !directorContext.user.tournaments.some(t => t.identifier === tournament.identifier)) {
      router.push('/director');
    }
  }, [directorContext]);

  // This effect pulls the team details from the backend
  useEffect(() => {
    if (!identifier || !directorContext || !directorContext.token) {
      return;
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
        setLoading(false);
        setTeam(response.data);
      })
      .catch(error => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 401) {
            directorContext.logout();
            router.push('/director/login');
          }
          setErrorMessage(error.statusText);
        } else {
          setErrorMessage('An unknown error occurred!');
        }
      });
  }, [identifier, directorContext]);

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

  if (!team) {
    return (
      <div className={'display-6 text-center'}>
        Retrieving team details...
      </div>
    );
  }

  const deleteSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm('This will remove the team and all its bowlers. Are you sure?')) {
      setLoading(true);
      const requestConfig = {
        method: 'delete',
        url: `${apiHost}/director/teams/${identifier}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': directorContext.token,
        },
      }
      setLoading(true);
      axios(requestConfig)
        .then(response => {
          setLoading(false);
          router.push('/director/teams?success=deleted');
        })
        .catch(error => {
          setLoading(false);
          if (error.response) {
            if (error.response.status === 401) {
              directorContext.logout();
              router.push('/director/login');
            } else if (error.response.status === 404) {
              setErrorMessage('Could not find that team to delete it.');
            } else {
              setErrorMessage(error.response.errors.join(' '));
            }
          } else {
            setErrorMessage('An unknown error occurred!');
          }
        });
    }
  }

  const deleteTeamCard = (
    <Card>
      <Card.Body className={'text-center'}>
        <form onSubmit={deleteSubmitHandler}>
          <Button variant={'danger'}
                  type={'submit'}
          >
            Delete Team
          </Button>
        </form>
      </Card.Body>
    </Card>
  );

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: directorContext.tournament.name, path: `/director/tournaments/${directorContext.tournament.identifier}`},
    {text: 'Teams', path: `/director/teams`},
  ];

  let teamName;
  if (team) {
    teamName = team.name;
  }

  const updateSubmitHandler = (teamData) => {
    const requestConfig = {
      method: 'patch',
      url: `${apiHost}/director/teams/${identifier}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': directorContext.token,
      },
      data: {
        team: teamData,
      },
    }
    setLoading(true);
    axios(requestConfig)
      .then(response => {
        setLoading(false);
        setTeam(response.data);
      })
      .catch(error => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 401) {
            directorContext.logout();
            router.push('/director/login');
          }
          setErrorMessage(error.response.errors.join(' '));
        } else {
          setErrorMessage('An unknown error occurred!');
        }
      });
  }

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={teamName} />
      <Row>
        <Col md={8}>
          <TeamDetails team={team}
                       teamUpdateSubmitted={updateSubmitHandler}
          />
        </Col>
        <Col md={4}>
          {deleteTeamCard}
        </Col>
      </Row>
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