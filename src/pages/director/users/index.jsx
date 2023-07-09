import React from "react";
import {useRouter} from "next/router";
import Link from 'next/link';

import {Col, Row} from "react-bootstrap";

import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserListing from '../../../components/Director/UserListing/UserListing';
import UserForm from '../../../components/Director/UserForm/UserForm';
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {useDirectorApi} from "../../../director";
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
          {success === 'deleted' && (
            <SuccessAlert message={'The user has been removed.'}
                          className={``}
                          onClose={() => {
                            router.replace(router.pathname, null, {shallow: true})
                          }}/>
          )}
          <ErrorAlert message={usersError}
                      className={``}/>
          <ErrorAlert message={tournamnentsError}
                      className={``}/>
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
