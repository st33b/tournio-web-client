import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {Col, Row} from "react-bootstrap";

import {directorApiRequest} from "../../../utils";
import {useDirectorContext} from '../../../store/DirectorContext';
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserForm from '../../../components/Director/UserForm/UserForm';

const Page = () => {
  const directorContext = useDirectorContext();
  const router = useRouter();
  const { identifier } = router.query;

  const isSuperuser = directorContext.user && directorContext.user.role === 'superuser';
  const isEditingSelf = directorContext.user && directorContext.user.identifier === identifier;
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }
    if (!isSuperuser && !isEditingSelf) {
      router.push('/director');
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const onSuccess = (data) => {
    setUserDetails(data);
    setIsLoading(false);
  }

  const onFailure = (data) => {
    setIsLoading(false);
    if (data.error) {
      setErrorMessage(data.error);
    } else {
      setErrorMessage('Whoops!');
    }
  }

  useEffect(() => {
    if (!identifier) {
      return;
    }

    const uri = `/director/users/${identifier}`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: onSuccess,
      onFailure: onFailure});
  }, [identifier]);

  const onTournamentsFetched = (data) => {
    setTournaments(data);
    setIsLoading(false);
  }

  const onTournamentsFetchFailure = (data) => {
    setIsLoading(false);
    // TODO
  }

  // Retrieve list of available tournaments
  useEffect(() => {
    const uri = `/director/tournaments?upcoming`;
    const requestConfig = {
      method: 'get',
    }
    setIsLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: onTournamentsFetched,
      onFailure: onTournamentsFetchFailure,
    });
  }, []);

  const onDeleteSuccess = (_) => {
    setIsLoading(false);
    router.push('/director/users?success=deleted');
  }

  const onDeleteFailure = (data) => {
    setIsLoading(false);
    setErrorMessage(`Failed to delete user. ${data.error}`);
  }

  const deleteInitiated = () => {
    if (confirm('This will remove the user and their ability to administer any tournaments. Are you sure?')) {
      setIsLoading(true);
      const uri = `/director/users/${identifier}`;
      const requestConfig = {
        method: 'delete',
      }
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        context: directorContext,
        router: router,
        onSuccess: onDeleteSuccess,
        onFailure: onDeleteFailure,
      });
    }
  }

  return (
    <div className={'mt-3'}>
      <Row>
        <Col sm={{span: 8, offset: 2}} md={{span: 6, offset: 3}}>
          {errorMessage && <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center'} role={'alert'}>
            <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
            <div className={'me-auto'}>
              <strong>
                Oh no!
              </strong>
              {' '}{errorMessage}
            </div>
            <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"} />
          </div>
          }
          {isLoading && <p className={'text-center'}>Retrieving user details...</p>}
          {!isLoading && <UserForm user={userDetails}
                                   tournaments={tournaments}
                                   userDeleteInitiated={deleteInitiated}
          />}
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