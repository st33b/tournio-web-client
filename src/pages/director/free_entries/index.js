import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Row, Col, Card} from "react-bootstrap";

import {devConsoleLog} from "../../../utils";
import {directorApiRequest, useLoggedIn} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import FreeEntryListing from "../../../components/Director/FreeEntryListing/FreeEntryListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import NewFreeEntryForm from "../../../components/Director/NewFreeEntryForm/NewFreeEntryForm";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {
  freeEntryAdded,
  freeEntryDeleted,
} from "../../../store/actions/directorActions";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [freeEntries, setFreeEntries] = useState();

  // Make sure we're logged in with appropriate permissions
  useEffect(() => {
    if (directorState.tournament === null) {
      router.push('/director');
    }

    const currentTournamentIdentifier = directorState.tournament.identifier;

    if (directorState.user.role !== 'superuser' && !directorState.user.tournaments.some(t => t.identifier === currentTournamentIdentifier)) {
      router.push('/director');
    }
  });

  const freeEntriesFetched = (data) => {
    setFreeEntries(data);
    setLoading(false);
  }

  const freeEntriesFetchFailed = (data) => {
    setFreeEntries([]);
    setErrorMessage(data.error);
    setLoading(false);
  }

  // Fetch the free entries from the backend
  useEffect(() => {
    if (!directorState.tournament) {
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
      onSuccess: freeEntriesFetched,
      onFailure: freeEntriesFetchFailed,
    });
  }, [directorState.tournament]);

  // Do we have a success query parameter?
  useEffect(() => {
    const {success} = router.query;
    if (success === 'deleted') {
      setSuccessMessage('The free entry has been deleted.');
      router.replace(router.pathname, null, { shallow: true });
    }
  }, [router]);

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
      onSuccess: (data) => deleteFreeEntrySuccess(data, freeEntry),
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  const confirmFreeEntrySuccess = (data) => {
    setSuccessMessage('Free entry confirmed!');
    const index = freeEntries.findIndex(t => t.identifier === data.identifier);
    const newFreeEntries = [...freeEntries];
    newFreeEntries[index] = {...freeEntries[index]};
    newFreeEntries[index].confirmed = true;
    setFreeEntries(newFreeEntries);
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
      onSuccess: (data) => confirmFreeEntrySuccess(data),
      onFailure: (data) => setErrorMessage(data.error),
    });
  }

  const newFreeEntrySuccess = (data) => {
    setSuccessMessage('Free entry created!');
    dispatch(freeEntryAdded(data));
    const newFreeEntries = freeEntries.concat(data);
    setFreeEntries(newFreeEntries);
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

  if (loading) {
    return <LoadingMessage message={'Retrieving free entry data...'} />
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
  ];
  ladder.push({text: directorState.tournament.name, path: `/director/tournaments/${directorState.tournament.identifier}`});

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={'Free Entries'}/>
      <Row>
        <Col md={8}>
          {success}
          {error}
          <FreeEntryListing freeEntries={freeEntries}
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
