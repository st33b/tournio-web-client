import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from 'next/link';

import {Col, Row} from "react-bootstrap";

import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserListing from '../../../components/Director/UserListing/UserListing';
import UserForm from '../../../components/Director/UserForm/UserForm';
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {directorApiRequest, useDirectorApi, useLoggedIn} from "../../../director";
import {useDirectorContext} from '../../../store/DirectorContext';
import {tournamentListRetrieved, userListRetrieved} from "../../../store/actions/directorActions";
import SuccessAlert from "../../../components/common/SuccessAlert";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const router = useRouter();

  const {success} = router.query;

  const {loading: usersLoading, data: users, error: usersError, onDataUpdate} = useDirectorApi({
    uri: '/users',
  });

  const {loading: tournamentsLoading, data: tournaments, error: tournamnentsError} = useDirectorApi({
    uri: '/tournaments',
  });

  const userAdded = (user) => {
    const newUsers = users.concat(user);
    onDataUpdate(newUsers);
  }

  const userUpdated = (user) => {
    onDataUpdate(users);
  }

  //////////////////////////////////////////////////////////////////////////

  if (usersLoading || tournamentsLoading) {
    return <LoadingMessage message={'Retrieving users, gimme a sec...'} />
  }

  return (
    <div className={'mt-2'}>
      <Row>
        <Col lg={8}>
          {success === 'delete' && (
            <SuccessAlert message={'The user has been removed.'}
                          className={`mt-3`}
                          onClose={() => {
                            router.replace(router.pathname, null, {shallow: true})
                          }}/>
          )}
          <ErrorAlert message={usersError}
                      className={`mt-3`}/>
          <ErrorAlert message={tournamnentsError}
                      className={`mt-3`}/>
          <UserListing users={users} tournaments={tournaments}/>
        </Col>
        <Col>
          <UserForm tournaments={tournaments}
                    onUserAdded={userAdded}
                    onUserUpdated={userUpdated}
          />
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
