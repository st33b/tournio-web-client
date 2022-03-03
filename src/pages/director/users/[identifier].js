// The page for editing a single user's details

import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {Col, Row} from "react-bootstrap";

import {apiHost} from "../../../utils";
import {useDirectorContext} from '../../../store/DirectorContext';
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserForm from '../../../components/Director/UserForm/UserForm';
import axios from "axios";

const index = () => {
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
      console.log("Nice try, but you're not logged in as a superuser.");
      router.push('/director');
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    if (!identifier) {
      return;
    }
    const requestConfig = {
      url: `${apiHost}/director/users/${identifier}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      },
      method: 'get',
    }
    axios(requestConfig)
      .then(response => {
        setUserDetails(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        if (error.response.status === 401) {
          directorContext.logout();
          router.push('/director/login');
        }
      });
  }, [identifier]);

  return (
    <div className={'mt-3'}>
      <Row>
        <Col sm={{span: 8, offset: 2}} md={{span: 6, offset: 3}}>
          {isLoading && <p className={'text-center'}>Retrieving user details...</p>}
          {!isLoading && <UserForm user={userDetails}/>}
        </Col>
      </Row>
    </div>
  );
}

index.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default index;