import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {devConsoleLog, directorApiRequest, useClientReady} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import BowlerListing from "../../../components/Director/BowlerListing/BowlerListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {bowlerListReset, bowlerListRetrieved} from "../../../store/actions/directorActions";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const dispatch = context.dispatch;
  const directorState = context.directorState;
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  let identifier;
  if (context && directorState.tournament) {
    identifier = directorState.tournament.identifier;
  }

  // Ensure we're logged in, with appropriate permission
  useEffect(() => {
    if (!identifier) {
      return;
    }
    if (!context || !context.user || !directorState) {
      return;
    }
    if (!context.isLoggedIn) {
      router.push('/director/login');
    }
    if (context.user.role !== 'superuser' && !context.user.tournaments.some(t => t.identifier === identifier)) {
      router.push('/director');
    }
  }, [identifier, router, context]);

  const onFetchBowlersSuccess = (data) => {
    dispatch(bowlerListRetrieved(data));
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
    // Don't fetch the list again if we already have it.
    if (directorState.bowlers && directorState.bowlers.length > 0) {
      devConsoleLog("Not re-fetching the list of bowlers.");
      return;
    }

    const uri = `/director/tournaments/${identifier}/bowlers`;
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: onFetchBowlersSuccess,
      onFailure: onFetchBowlersFailure,
    })
  }, [identifier, router, context]);

  // Do we have a success query parameter?
  useEffect(() => {
    const {success} = router.query;
    if (success === 'deleted') {
      setSuccessMessage('The bowler has been removed.');
      router.replace(router.pathname, null, { shallow: true });
    }
  }, [router]);

  const ready = useClientReady();
  if (!ready) {
    return '';
  }

  let success = '';
  let error = '';
  if (successMessage) {
    success = (
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mb-0'} role={'alert'}>
        <i className={'bi-check-circle-fill pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          <strong>
            Success!
          </strong>
          {' '}{successMessage}
        </div>
        <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"} />
      </div>
    );
  }
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mb-0'} role={'alert'}>
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

  const ladder = [{text: 'Tournaments', path: '/director'}];
  if (directorState.tournament) {
    ladder.push({text: directorState.tournament.name, path: `/director/tournaments/${identifier}`});
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving bowler data...'} />
  }

  const refreshList = (e) => {
    e.preventDefault();
    dispatch(bowlerListReset());
  }

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={'Bowlers'}/>
      <div className={'row'}>
        <div className={'col-12'}>
          {success}
          {error}
          <BowlerListing bowlers={directorState.bowlers} />
        </div>
      </div>
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
    </div>
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