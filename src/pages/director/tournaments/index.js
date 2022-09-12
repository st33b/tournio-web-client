import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import TournamentListing from '../../../components/Director/TournamentListing/TournamentListing';
import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest, useClientReady} from "../../../utils";
import {tournamentListReset, tournamentListRetrieved} from "../../../store/actions/directorActions";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {Col, Row} from "react-bootstrap";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const directorState = context.directorState;
  const dispatch = context.dispatch;

  useEffect(() => {
    if (!context.isLoggedIn) {
      router.push('/director/login');
    }
  });

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
    if (!context || !directorState) {
      return;
    }
    // Don't fetch the list again if we already have it.
    if (directorState.tournaments && directorState.tournaments.length > 0) {
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
      router: router,
      onSuccess: fetchTournamentsSuccess,
      onFailure: fetchTournamentsFailure,
    });
  }, [directorState.tournaments]);

  const ready = useClientReady();
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