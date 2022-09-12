import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {Col, Row} from "react-bootstrap";

import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserListing from '../../../components/Director/UserListing/UserListing';
import UserForm from '../../../components/Director/UserForm/UserForm';
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {directorApiRequest, useClientReady} from "../../../utils";
import {useDirectorContext} from '../../../store/DirectorContext';
import {tournamentListRetrieved, userListRetrieved} from "../../../store/actions/directorActions";

const Page = () => {
  const context = useDirectorContext();
  const directorState = context.directorState;
  const dispatch = context.dispatch;
  const router = useRouter();

  const isSuperuser = context.user && context.user.role === 'superuser';
  useEffect(() => {
    if (!isSuperuser) {
      console.log("Nice try, but you're not logged in as a superuser.");
      router.push('/director');
    }
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Do we have a success query parameter?
  useEffect(() => {
    const {success} = router.query;
    if (success === 'deleted') {
      setSuccessMessage('The user has been removed.');
      router.replace(router.pathname, null, { shallow: true });
    }
  }, [router]);

  const usersRetrieved = (data) => {
    dispatch(userListRetrieved(data));
    setLoading(false);
  }

  const usersFailedToRetrieve = (data) => {
    setLoading(false);
    console.log("D'oh!", data);
    setErrorMessage('Failed to retrieve list of users');
  }

  // fetch the list of users to send to the listing component -- but only if we haven't fetched them yet
  useEffect(() => {
    if (!context || !directorState) {
      return;
    }

    // Don't fetch the list if we have some in state already.
    if (directorState.users.length > 0) {
      console.log("User list already in state, not fetching again");
      return;
    }

    const uri = `/director/users`;
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: usersRetrieved,
      onFailure: usersFailedToRetrieve,
    });
  }, []);

  const fetchTournamentsFailure = (data) => {
    setErrorMessage(data.error);
  }

  // Retrieve the list of tournaments if we need to, for the new-user form
  useEffect(() => {
    if (!context || !directorState) {
      return;
    }
    // Don't fetch the list again if we already have it.
    if (directorState.tournaments && directorState.tournaments.length > 0) {
      console.log("List of tournaments is already in state, not re-fetching");
      return;
    }
    const uri = '/director/tournaments';
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: (data) => dispatch(tournamentListRetrieved(data)),
      onFailure: (_) => setErrorMessage(data.error),
    });
  }, []);

  const ready = useClientReady();
  if (!ready) {
    return '';
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving users, gimme a sec...'} />
  }

  let success = '';
  let error = '';
  if (successMessage) {
    success = (
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
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

  return (
    <div className={'mt-2'}>
      <Row>
        <Col lg={8}>
          {success}
          {error}
          <UserListing tournaments={directorState.tournaments}/>
        </Col>
        <Col>
          <UserForm tournaments={directorState.tournaments}/>
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