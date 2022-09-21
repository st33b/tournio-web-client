import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Card} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import TeamListing from "../../../components/Director/TeamListing/TeamListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import NewTeamForm from "../../../components/Director/NewTeamForm/NewTeamForm";
import {devConsoleLog} from "../../../utils";
import {directorApiRequest, useLoggedIn} from "../../../director";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {teamAdded, teamListRetrieved} from "../../../store/actions/directorActions";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const directorState = context.directorState;
  const dispatch = context.dispatch;
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // This effect ensures we're logged in with appropriate permissions
  useEffect(() => {
    const currentTournamentIdentifier = directorState.tournament.identifier;

    if (directorState.user.role !== 'superuser' && !directorState.user.tournaments.some(t => t.identifier === currentTournamentIdentifier)) {
      router.push('/director');
    }
  });

  const onFetchTeamsSuccess = (data) => {
    dispatch(teamListRetrieved(data));
    setLoading(false);
  }

  const onFetchTeamsFailure = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  // This effect fetches the teams from the backend, if needed
  useEffect(() => {
    // Don't fetch the list again if we already have it.
    const needToFetch = directorState.teams && directorState.tournament &&
      directorState.teams.length === 0 && directorState.tournament.team_count > 0;
    if (!needToFetch) {
      devConsoleLog("Not re-fetching the list of teams.");
      return;
    }

    const uri = `/director/tournaments/${directorState.tournament.identifier}/teams`;
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: onFetchTeamsSuccess,
      onFailure: onFetchTeamsFailure,
    });
  });

  // Do we have a success query parameter?
  useEffect(() => {
    const {success} = router.query;
    if (success === 'deleted') {
      setSuccessMessage('The team has been removed.');
      router.replace(router.pathname, null, { shallow: true });
    }
  }, [router]);

  const loggedInState = useLoggedIn();
  const ready = loggedInState >= 0;
  if (!ready) {
    return '';
  }
  if (!loggedInState) {
    router.push('/director/login');
  }
  if (!directorState) {
    return '';
  }

  const newTeamSubmitSuccess = (data) => {
    setSuccessMessage('New team created!');
    dispatch(teamAdded(data));
  }

  const newTeamSubmitFailure = (data) => {
    setErrorMessage('Failed to create a new team. Why? ' + data.error);
  }

  const newTeamSubmitted = (teamName) => {
    const uri = `/director/tournaments/${directorState.tournament.identifier}/teams`;
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        team: {
          name: teamName,
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: newTeamSubmitSuccess,
      onFailure: newTeamSubmitFailure,
    });
  }

  let success = '';
  let error = '';
  if (successMessage) {
    success = (
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-0 mb-3'} role={'alert'}>
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
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-0 mb-3'} role={'alert'}>
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

  const newTeam = (
    <Card>
      <Card.Header as={'h5'} className={'fw-light'}>
        New Team
      </Card.Header>
      <Card.Body>
        <NewTeamForm submitted={newTeamSubmitted} />
      </Card.Body>
    </Card>
  );

  const ladder = [{text: 'Tournaments', path: '/director'}];
  if (directorState.tournament) {
    ladder.push({text: directorState.tournament.name, path: `/director/tournaments/${directorState.tournament.identifier}`});
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving team data...'} />
  }

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={'Teams'}/>
      <div className={'row'}>
        <div className={'order-2 order-md-1 col'}>
          {success}
          {error}
          <TeamListing teams={directorState.teams} />
        </div>
        <div className={'order-1 order-md-2 col-12 col-md-4'}>
          {newTeam}
        </div>
      </div>
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