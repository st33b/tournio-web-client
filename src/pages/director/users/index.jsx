import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {Col, Row} from "react-bootstrap";

import {useDirectorContext} from '../../../store/DirectorContext';
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserListing from '../../../components/Director/UserListing/UserListing';
import UserForm from '../../../components/Director/UserForm/UserForm';
import {directorApiRequest} from "../../../utils";

const page = () => {
  const directorContext = useDirectorContext();
  const router = useRouter();

  const isSuperuser = directorContext.user && directorContext.user.role === 'superuser';
  useEffect(() => {
    if (!isSuperuser) {
      console.log("Nice try, but you're not logged in as a superuser.");
      router.push('/director');
    }
  });

  const [users, setUsers] = useState();
  const [tournaments, setTournaments] = useState([]);
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
  });

  const usersRetrieved = (data) => {
    setUsers(data);
    setLoading(false);
  }

  const usersFailedToRetrieve = (data) => {
    setLoading(false);
    // TODO
  }

  // fetch the list of users to send to the listing component
  useEffect(() => {
    const uri = `/director/users`;
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      onSuccess: usersRetrieved,
      onFailure: usersFailedToRetrieve,
    });
  }, []);

  const onTournamentsFetched = (data) => {
    setTournaments(data);
    setLoading(false);
  }

  const onTournamentsFetchFailure = (data) => {
    setLoading(false);
    // TODO
  }

  // Retrieve list of available tournaments
  useEffect(() => {
    const uri = `/director/tournaments?upcoming`;
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: onTournamentsFetched,
      onFailure: onTournamentsFetchFailure,
    });
  }, []);

  if (loading) {
    return (
      <div className={'mt-2'}>
        <h4 className={'display-6'}>
          Retrieving users &amp; tournaments, gimme a sec...
        </h4>
      </div>
    );
  }

  const userAdded = (newUser) => {
    const existingUsers = [...users];
    existingUsers.push(newUser);
    existingUsers.sort((left, right) => (left.email.localeCompare(right.email)));
    setUsers(users);
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
          <UserListing users={users} />
        </Col>
        <Col>
          <UserForm tournaments={tournaments}/>
        </Col>
      </Row>
    </div>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default page;