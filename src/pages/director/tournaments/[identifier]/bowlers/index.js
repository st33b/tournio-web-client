import React from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {useDirectorApi, useTournament} from "../../../../../director";
import DirectorLayout from "../../../../../components/Layout/DirectorLayout/DirectorLayout";
import BowlerListing from "../../../../../components/Director/BowlerListing/BowlerListing";
import Breadcrumbs from "../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../../../components/common/ErrorBoundary";
import SuccessAlert from "../../../../../components/common/SuccessAlert";
import ErrorAlert from "../../../../../components/common/ErrorAlert";

const BowlersIndex = () => {
  const router = useRouter();
  const {identifier, deleteSuccess} = router.query;

  const {loading: tournamentLoading, tournament} = useTournament();
  const {loading: bowlersLoading, data: bowlers, error} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/bowlers` : null,
  });

  if (tournamentLoading || bowlersLoading) {
    return <LoadingMessage message={'Retrieving bowler data...'} />
  }

  if (!tournament || !bowlers) {
    return <LoadingMessage message={'Making sense of bowler data...'} />
  }

  ////////////////////

  const ladder = [{text: 'Tournaments', path: '/director'}];
  ladder.push({text: tournament.name, path: `/director/tournaments/${identifier}`});

  return (
    <ErrorBoundary>
      <Breadcrumbs ladder={ladder} activeText={'Bowlers'}/>
      <Row>
        <Col>
          {deleteSuccess && (
            <SuccessAlert message={'The bowler has been removed.'}
                          onClose={() => router.replace(router.pathname, null, {shallow: true})}/>
          )}
          {error && (
            <ErrorAlert message={error.message} className={'mx-3 mt-3'}/>
          )}
          <BowlerListing bowlers={bowlers} />
        </Col>
      </Row>
    </ErrorBoundary>
  );
}

BowlersIndex.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default BowlersIndex;
