import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {useDirectorContext} from "../../../../store/DirectorContext";
import {directorApiRequest, useLoggedIn} from "../../../../director";
import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const directorState = context.directorState;
  let {identifier} = router.query;

  const [bowler, setBowler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // This effect ensures that we have permission to administer the current tournament
  useEffect(() => {
    if (!directorState) {
      return;
    }
    const tournament = directorState.tournament;
    // if the logged-in user is a director but not for this tournament...
    if (directorState.user.role === 'director' && !directorState.user.tournaments.some(t => t.identifier === tournament.identifier)) {
      router.push('/director');
    }
  }, [directorState, router]);

  const fetchBowlerSuccess = (data) => {
    setLoading(false);
    setBowler(data);
  }
  const fetchBowlerFailure = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  // This effect pulls the bowler details from the backend
  useEffect(() => {
    if (!identifier || !context) {
      return;
    }

    const uri = `/director/bowlers/${identifier}`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: fetchBowlerSuccess,
      onFailure: fetchBowlerFailure,
    });
  }, [identifier, context, router]);

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

  let displayedError = '';
  if (errorMessage) {
    displayedError = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center m-3'}
           role={'alert'}>
        <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          <strong>
            Oh no!
          </strong>
          {' '}{errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={'container-md'}>
      {displayedError && (
        <Row>
          <Col>
            {displayedError}
          </Col>
        </Row>
      )}
      <SignInSheet tournament={directorState.tournament} bowler={bowler} showPrintButton={true}/>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return page;
}

export default Page;