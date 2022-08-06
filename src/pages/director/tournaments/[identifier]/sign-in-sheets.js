import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {directorApiRequest, fetchTournamentDetails} from "../../../../utils";
import {useDirectorContext} from "../../../../store/DirectorContext";
import DirectorLayout from "../../../../components/Layout/DirectorLayout/DirectorLayout";
import BowlerListing from "../../../../components/Director/BowlerListing/BowlerListing";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import {useRegistrationContext} from "../../../../store/RegistrationContext";
import {Col, Row} from "react-bootstrap";
import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";

const Page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  const {dispatch} = useRegistrationContext();
  const [errorMessage, setErrorMessage] = useState(null);
  const [bowlers, setBowlers] = useState(null);
  const [loading, setLoading] = useState(true);

  const {identifier} = router.query;

  // Ensure we're logged in, with appropriate permission
  useEffect(() => {
    if (!identifier) {
      return;
    }
    if (!directorContext || !directorContext.user) {
      return;
    }
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
    if (directorContext.user.role !== 'superuser' && !directorContext.user.tournaments.some(t => t.identifier === identifier)) {
      router.push('/director');
    }
  }, [identifier, router, directorContext]);

  // Ensure that the tournament in context matches the one identified in the URL
  useEffect(() => {
    if (!identifier) {
      return;
    }
    if (!directorContext || !directorContext.tournament) {
      return;
    }
    if (directorContext.tournament.identifier !== identifier) {
      fetchTournamentDetails(identifier, dispatch);
    }
  }, [identifier]);

  const onFetchBowlersSuccess = (data) => {
    setBowlers(data);
    setLoading(false);
  }

  const onFetchBowlersFailure = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  // Fetch the bowlers from the backend
  useEffect(() => {
    if (!identifier) {
      return;
    }

    const uri = `/director/tournaments/${identifier}/bowlers`;
    const requestConfig = {
      method: 'get',
      params: {
        include_details: true,
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: onFetchBowlersSuccess,
      onFailure: onFetchBowlersFailure,
    })
  }, [identifier, router, directorContext]);

  let error = '';
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
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

  if (loading) {
    return (
      <>
        <LoadingMessage message={'Retrieving bowler data...'} />
        <p className={'lead text-center'}>This may take a bit...</p>
      </>
    );
  }

  if (error) {
    return (
      <div className={'container-md'}>
        <Row>
          <Col>
            {error}
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className={'container-md'}>
      {
        bowlers.map((bowler, i) => <SignInSheet bowler={bowler} key={bowler.identifier} showPrintButton={i === 0}/>)
      }
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return page;
}

export default Page;