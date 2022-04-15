import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {useDirectorContext} from "../../../../store/DirectorContext";
import {directorApiRequest} from "../../../../utils";
import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";

const Page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  let {identifier} = router.query;

  const [bowler, setBowler] = useState(null);
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
  }, [directorContext, router]);

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
    if (!identifier || !directorContext || !directorContext.token) {
      return;
    }

    const uri = `/director/bowlers/${identifier}`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: fetchBowlerSuccess,
      onFailure: fetchBowlerFailure,
    });
  }, [identifier, directorContext, router]);

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
      <SignInSheet bowler={bowler}/>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return page;
}

export default Page;