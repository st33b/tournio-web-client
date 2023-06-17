import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import {useDirectorApi} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import BowlerListing from "../../../components/Director/BowlerListing/BowlerListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../components/common/ErrorBoundary";

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
            <Alert variant={'success'}
                   dismissible={true}
                   closeLabel={'Close'}
                   onClose={() => router.replace(router.pathname, null, {shallow: true})}>
              <span>
                <i className={'bi bi-check-circle-fill pe-2'} aria-hidden={true} />
                <strong>Success!</strong>{' '}
                The bowler has been removed.
              </span>
            </Alert>
          )}
          {error && (
            <Alert variant={'danger'}
                   dismissible={true}
                   closeLabel={'Close'}>
              <span>
                <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
                <strong>Error.</strong>{' '}
                {error.message}
              </span>
            </Alert>
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
