import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Card, Button, Row, Col} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import TeamDetails from "../../../components/Director/TeamDetails/TeamDetails";
import {directorApiRequest} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();

  let {identifier} = router.query;

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
  }, [directorContext, router]);

  const onFetchTeamSuccess = (data) => {
    setLoading(false);
    setTeam(data);
  }

  const onFetchTeamFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  // This effect pulls the team details from the backend
  useEffect(() => {
    if (!identifier || !directorContext || !directorContext.token) {
      return;
    }

    const uri = `/director/teams/${identifier}`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: onFetchTeamSuccess,
      onFailure: onFetchTeamFailure,
    });
  }, [identifier, router]);

  if (!directorContext || loading) {
    return <LoadingMessage message={'Retrieving team data...'} />;
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

  const onDeleteTeamSuccess = (_) => {
    setLoading(false);
    router.push('/director/teams?success=deleted');
  }

  const onDeleteTeamFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  const deleteSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm('This will remove the team and all its bowlers. Are you sure?')) {
      setLoading(true);
      const uri = `/director/teams/${identifier}`;
      const requestConfig = {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      setLoading(true);
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        context: directorContext,
        router: router,
        onSuccess: onDeleteTeamSuccess,
        onFailure: onDeleteTeamFailure,
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

  const updateTeamSuccess = (data) => {
    setLoading(false);
    setTeam(data);
  }

  const updateTeamFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  const updateSubmitHandler = (teamData) => {
    const uri = `/director/teams/${identifier}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        team: teamData,
      },
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: updateTeamSuccess,
      onFailure: updateTeamFailure,
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
          {successMessage && (
            <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mb-3'} role={'alert'}>
              <i className={'bi-check-circle-fill pe-2'} aria-hidden={true} />
              <div className={'me-auto'}>
                <strong>
                  Success!
                </strong>
                {' '}{successMessage}
              </div>
              <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"} />
            </div>
          )}
          {deleteTeamCard}
        </Col>
      </Row>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Page;