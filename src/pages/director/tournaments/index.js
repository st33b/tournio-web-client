import {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {useRouter} from "next/router";

import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import TournamentListing from '../../../components/Director/TournamentListing/TournamentListing';
import {useDirectorContext} from "../../../store/DirectorContext";
import {tournamentListReset, tournamentListRetrieved} from "../../../store/actions/directorActions";
import {devConsoleLog} from "../../../utils";
import {directorApiRequest, useLoggedIn} from "../../../director";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const directorState = context.directorState;
  const dispatch = context.dispatch;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const fetchTournamentsSuccess = (data) => {
    const tournaments = data;
    dispatch(tournamentListRetrieved(data));
    if (tournaments.length === 1) {
      // redirect to the details page for their one tournament.
      const identifier = tournaments[0]['identifier'];
      router.push(`/director/tournaments/${identifier}`);
      return;
    }
    setLoading(false);
  }

  const fetchTournamentsFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  useEffect(() => {
    if (!directorState || !directorState.tournaments) {
      return;
    }

    // Don't fetch the list again if we already have it.
    if (directorState.tournaments.length > 0) {
      devConsoleLog("Already have a list of tournaments, not re-fetching it");
      return;
    }
    const uri = '/director/tournaments';
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: fetchTournamentsSuccess,
      onFailure: fetchTournamentsFailure,
    });
  }, [directorState.tournaments]);

  const loggedInState = useLoggedIn();
  const ready = loggedInState >= 0;
  if (!loggedInState) {
    router.push('/director/login');
  }

  if (!ready || loading) {
    return <LoadingMessage message={'Retrieving data...'} />;
  }

  const refreshList = (e) => {
    e.preventDefault();
    dispatch(tournamentListReset());
  }

  return (
    <>
      {errorMessage && (
        <Row>
          <Col>
            <p className={'text-danger'}>
              {errorMessage}
            </p>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <TournamentListing />
        </Col>
      </Row>
      <Row>
        <Col className={'text-center'}>
          <a href={'#'}
             className={'btn btn-sm btn-outline-primary'}
             onClick={refreshList}
             >
            Refresh List
          </a>
        </Col>
      </Row>
    </>
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