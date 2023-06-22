import React from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {useDirectorApi, useTournament} from "../../../../../director";
import DirectorLayout from "../../../../../components/Layout/DirectorLayout/DirectorLayout";
import TeamListing from "../../../../../components/Director/TeamListing/TeamListing";
import Breadcrumbs from "../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../../../components/common/ErrorBoundary";
import SuccessAlert from "../../../../../components/common/SuccessAlert";
import ErrorAlert from "../../../../../components/common/ErrorAlert";

const TeamsIndex = () => {
  const router = useRouter();
  const {identifier, deleteSuccess} = router.query;

  const {loading: tournamentLoading, tournament} = useTournament();
  const {loading: teamsLoading, data: teams, error} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/teams` : null,
  });

  if (tournamentLoading || teamsLoading) {
    return <LoadingMessage message={'Retrieving team data...'} />
  }

  if (!tournament || !teams) {
    return <LoadingMessage message={'Making sense of team data...'} />
  }

  ////////////////////

  const ladder = [{text: 'Tournaments', path: '/director'}];
  ladder.push({text: tournament.name, path: `/director/tournaments/${identifier}`});

  return (
    <ErrorBoundary>
      <Breadcrumbs ladder={ladder} activeText={'Teams'}/>
      <Row>
        <Col>
          {deleteSuccess && (
            <SuccessAlert message={'The team has been removed.'}
                          onClose={() => router.replace(router.pathname, null, {shallow: true})}/>
          )}
          {error && (
            <ErrorAlert message={error.message} className={'mx-3 mt-3'}/>
          )}
          <TeamListing teams={teams} />
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
