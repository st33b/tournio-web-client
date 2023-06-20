import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import {useDirectorApi} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import BowlerListing from "../../../components/Director/BowlerListing/BowlerListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../components/common/ErrorBoundary";
import React, {useEffect} from "react";
import SuccessAlert from "../../../components/common/SuccessAlert";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const router = useRouter();
  const {state} = useDirectorContext();
  const {deleteSuccess} = router.query;

  // Fetch the bowlers from the backend
  const {loading, data: bowlers, error} = useDirectorApi({
    uri: state.tournament ? `/tournaments/${state.tournament.identifier}/bowlers` : null,
  });

  if (!state.tournament || loading) {
    return <LoadingMessage message={'Retrieving bowler data...'} />
  }

  ////////////////////

  const ladder = [{text: 'Tournaments', path: '/director'}];
  ladder.push({text: state.tournament.name, path: `/director/tournaments/${state.tournament.identifier}`});

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

Page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Page;
