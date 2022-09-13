import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Row, Col, Card} from "react-bootstrap";

import {devConsoleLog, directorApiRequest, useClientReady} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import FreeEntryListing from "../../../components/Director/FreeEntryListing/FreeEntryListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import NewFreeEntryForm from "../../../components/Director/NewFreeEntryForm/NewFreeEntryForm";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {
  freeEntryAdded,
  freeEntryDeleted,
  freeEntryListRetrieved,
  freeEntryUpdated
} from "../../../store/actions/directorActions";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Make sure we're logged in
  useEffect(() => {
    if (!context.isLoggedIn) {
      router.push('/director/login');
    }
  });

  // Make sure we're logged in with appropriate permissions
  useEffect(() => {
    const currentTournamentIdentifier = directorState.tournament.identifier;

    if (context.user.role !== 'superuser' && !context.user.tournaments.some(t => t.identifier === currentTournamentIdentifier)) {
      router.push('/director');
    }
  });

  const freeEntriesFetched = (data) => {
    dispatch(freeEntryListRetrieved(data));
    setLoading(false);
  }

  const freeEntriesFetchFailed = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  // Fetch the free entries from the backend
  useEffect(() => {
    // Don't fetch the list again if we already have it.
    const needToFetch = directorState.freeEntries && directorState.tournament &&
      directorState.freeEntries.length === 0 && directorState.tournament.free_entry_count > 0;
    if (!needToFetch) {
      devConsoleLog("Not re-fetching the list of teams.");
      return;
    }

    const uri = `/director/tournaments/${directorState.tournament.identifier}/free_entries`;
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: freeEntriesFetched,
      onFailure: freeEntriesFetchFailed,
    });
  });

  // Do we have a success query parameter?
  useEffect(() => {
    const {success} = router.query;
    if (success === 'deleted') {
      setSuccessMessage('The free entry has been deleted.');
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
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mb-3'}
           role={'alert'}>
        <i className={'bi-check-circle-fill pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          <strong>
            Success!
          </strong>
          {' '}{successMessage}
        </div>
        <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"}/>
      </div>
    );
  }
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mb-3'}
           role={'alert'}>
        <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          <strong>
            Oh no!
          </strong>
          {' '}{errorMessage}
        </div>
        <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"}/>
      </div>
    );
  }

  const deleteFreeEntrySuccess = (data, freeEntry) => {
    setSuccessMessage('Free entry deleted!');
    dispatch(freeEntryDeleted(freeEntry));
  }

  const onDelete = (freeEntry) => {
    const uri = `/director/free_entries/${freeEntry.identifier}`;
    const requestConfig = {
      method: 'delete',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: (data) => deleteFreeEntrySuccess(data, freeEntry),
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  const confirmFreeEntrySuccess = (data) => {
    setSuccessMessage('Free entry confirmed!');
    dispatch(freeEntryUpdated(data));
  }

  const onConfirm = (freeEntry) => {
    const uri = `/director/free_entries/${freeEntry.identifier}/confirm`;
    const requestConfig = {
      method: 'post',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: (data) => confirmFreeEntrySuccess(data),
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  const newFreeEntrySuccess = (data) => {
    setSuccessMessage('Free entry created!');
    dispatch(freeEntryAdded(data));
  }

  const newFreeEntrySubmitted = (freeEntryCode) => {
    const uri = `/director/tournaments/${directorState.tournament.identifier}/free_entries`;
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        free_entry: {
          unique_code: freeEntryCode,
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: newFreeEntrySuccess,
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  const newFreeEntry = (
    <Card className={'mb-3'}>
      <Card.Header as={'h5'} className={'fw-light'}>
        New Free Entry
      </Card.Header>
      <Card.Body>
        <NewFreeEntryForm submitted={newFreeEntrySubmitted}/>
      </Card.Body>
    </Card>
  );

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
  ];
  // if (directorState.tournament) {
    ladder.push({text: directorState.tournament.name, path: `/director/tournaments/${directorState.tournament.identifier}`});
  // }

  if (loading) {
    return <LoadingMessage message={'Retrieving free entry data...'} />
  }

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={'Free Entries'}/>
      <Row>
        <Col md={8}>
          {success}
          {error}
          <FreeEntryListing freeEntries={directorState.freeEntries}
                            confirmClicked={onConfirm}
                            deleteClicked={onDelete}
          />
        </Col>
        <Col md={4}>
          {newFreeEntry}
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