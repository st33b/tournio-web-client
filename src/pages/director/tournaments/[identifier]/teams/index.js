import React, {useState} from "react";
import {useRouter} from "next/router";
import {Card, Col, Row} from "react-bootstrap";

import {directorApiRequest, useDirectorApi, useTournament} from "../../../../../director";
import DirectorLayout from "../../../../../components/Layout/DirectorLayout/DirectorLayout";
import TeamListing from "../../../../../components/Director/TeamListing/TeamListing";
import Breadcrumbs from "../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../../../components/common/ErrorBoundary";
import SuccessAlert from "../../../../../components/common/SuccessAlert";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import {useLoginContext} from "../../../../../store/LoginContext";
import NewTeamForm from "../../../../../components/Director/NewTeamForm/NewTeamForm";

const TeamsIndex = () => {
  const router = useRouter();
  const {authToken} = useLoginContext();
  const {identifier, deleteSuccess} = router.query;
  const [successMessage, setSuccessMessage] = useState();

  const {loading: tournamentLoading, tournament, tournamentUpdatedQuietly} = useTournament();
  const {loading: teamsLoading, data: teams, error, onDataUpdate: onTeamsUpdate} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/teams` : null,
  });

  const newTeamSubmitSuccess = (data) => {
    const newTeams = teams.concat(data);
    onTeamsUpdate(newTeams);
    const newTournament = updateObject(tournament, {
      team_count: tournament.team_count + 1,
    });
    tournamentUpdatedQuietly(newTournament);
    setSuccessMessage('Team created.');
  }

  const newTeamSubmitted = (teamName) => {
    const uri = `/tournaments/${identifier}/teams`;
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        team: {
          name: teamName,
          options: {
            place_with_others: true
          },
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: newTeamSubmitSuccess,
    });
  }

  ////////////////////

  if (tournamentLoading || teamsLoading) {
    return <LoadingMessage message={'Retrieving team data...'} />
  }

  if (!tournament || !teams) {
    return <LoadingMessage message={'Making sense of team data...'} />
  }

  const ladder = [{text: 'Tournaments', path: '/director'}];
  ladder.push({text: tournament.name, path: `/director/tournaments/${identifier}`});

  return (
    <ErrorBoundary>
      <Breadcrumbs ladder={ladder} activeText={'Teams'}/>
      <Row>
        <Col xs={{span: 12, order: 2}} md={{span: 8, order: 1}}>
          {deleteSuccess && (
            <SuccessAlert message={'The team has been removed.'}
                          onClose={() => router.replace(router.pathname, null, {shallow: true})}/>
          )}
          <SuccessAlert message={successMessage}
                        className={``}
                        onClose={() => {setSuccessMessage(null)}}
                        />
          {error && (
            <ErrorAlert message={error.message} className={'mx-3 mt-3'}/>
          )}
          <TeamListing teams={teams} />
        </Col>
        <Col xs={{span: 12, order: 1}} md={{span: 4, order: 2}}>
          <Card className={`mb-3`}>
            <Card.Header as={'h5'} className={'fw-light'}>
              New Team
            </Card.Header>
            <Card.Body>
              <NewTeamForm submitted={newTeamSubmitted} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </ErrorBoundary>
  );
}

TeamsIndex.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default TeamsIndex;
