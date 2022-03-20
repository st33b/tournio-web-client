import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Row, Col, Card} from "react-bootstrap";

import {directorApiRequest} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import FreeEntryListing from "../../../components/Director/FreeEntryListing/FreeEntryListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import NewFreeEntryForm from "../../../components/Director/NewFreeEntryForm/NewFreeEntryForm";

const Page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [freeEntries, setFreeEntries] = useState(null);
  const [loading, setLoading] = useState(true);

  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }

  // Ensure we're logged in, with appropriate permission
  useEffect(() => {
    if (!identifier) {
      return;
    }
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
    if (directorContext.user.role !== 'superuser' && !directorContext.user.tournaments.some(t => t.identifier === identifier)) {
      router.push('/director');
    }
  }, [identifier]);

  const freeEntriesFetched = (data) => {
    setFreeEntries(data);
    setLoading(false);
  }

  const freeEntriesFetchFailed = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  // Fetch the free entries from the backend
  useEffect(() => {
    if (!identifier) {
      return;
    }

    const uri = `/director/tournaments/${identifier}/free_entries`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: freeEntriesFetched,
      onFailure: freeEntriesFetchFailed,
    });
  }, [identifier]);

  // Do we have a success query parameter?
  useEffect(() => {
    const {success} = router.query;
    if (success === 'deleted') {
      setSuccessMessage('The free entry has been deleted.');
      router.replace(router.pathname, null, { shallow: true });
    }
  });

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

  const deleteFreeEntrySuccess = (data, i) => {
    setSuccessMessage('Free entry deleted!');
    const newFreeEntries = [...freeEntries];
    newFreeEntries.splice(i, 1);
    setFreeEntries(newFreeEntries);
  }

  const deleteFreeEntryFailure = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  const onDelete = (freeEntry) => {
    const index = freeEntries.indexOf(freeEntry);
    const uri = `/director/free_entries/${freeEntry.id}`;
    const requestConfig = {
      method: 'delete',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: (data) => deleteFreeEntrySuccess(data, index),
      onFailure: deleteFreeEntryFailure,
    });
  }

  const confirmFreeEntrySuccess = (data, i) => {
    setSuccessMessage('Free entry confirmed!');
    const newFreeEntries = freeEntries.splice(0);
    newFreeEntries[i].confirmed = true;
    setFreeEntries(newFreeEntries);
  }

  const confirmFreeEntryFailure = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  const onConfirm = (freeEntry) => {
    const index = freeEntries.indexOf(freeEntry);
    const uri = `/director/free_entries/${freeEntry.id}/confirm`;
    const requestConfig = {
      method: 'post',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: (data) => confirmFreeEntrySuccess(data, index),
      onFailure: confirmFreeEntryFailure,
    });
  }

  const newFreeEntrySuccess = (data) => {
    setSuccessMessage('Free entry created!');
    const newFreeEntries = [...freeEntries];
    newFreeEntries.push(data);
    setFreeEntries(newFreeEntries);
  }

  const newFreeEntryFailure = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  const newFreeEntrySubmitted = (freeEntryCode) => {
    const uri = `/director/tournaments/${identifier}/free_entries`;
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
      context: directorContext,
      router: router,
      onSuccess: newFreeEntrySuccess,
      onFailure: newFreeEntryFailure,
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
  if (directorContext.tournament) {
    ladder.push({text: directorContext.tournament.name, path: `/director/tournaments/${identifier}`});
  }

  if (loading) {
    return (
      <div>
        <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
      </div>
    );
  }

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