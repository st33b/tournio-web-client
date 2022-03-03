// The top-level page for directors

import React, {useEffect} from "react";
import {useRouter} from "next/router";

import {Col, Row} from "react-bootstrap";

import {useDirectorContext} from '../../../store/DirectorContext';
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserListing from '../../../components/Director/UserListing/UserListing';
import UserForm from '../../../components/Director/UserForm/UserForm';

const index = () => {
  const directorContext = useDirectorContext();
  const router = useRouter();

  const isSuperuser = directorContext.user && directorContext.user.role === 'superuser';
  useEffect(() => {
    if (!isSuperuser) {
      console.log("Nice try, but you're not logged in as a superuser.");
      router.push('/director');
    }
  });

  return (
    <div className={'mt-2'}>
      <Row>
        <Col lg={8}>
          <UserListing />
        </Col>
        <Col>
          <UserForm />
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