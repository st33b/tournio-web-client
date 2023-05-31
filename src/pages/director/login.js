import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {Card, Col, Row} from "react-bootstrap";

import DirectorLayout from '../../components/Layout/DirectorLayout/DirectorLayout';
import LoginForm from '../../components/Director/LoginForm/LoginForm';

const Login = () => {
  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const {password_reset_success} = router.query;
    if (password_reset_success) {
      setSuccessMessage('Your password was successfully changed. You may now use it to log in.');
      router.replace(router.pathname, null, {shallow: true});
    }
  }, [router]);

  const onLoginSuccess = () => {
    router.replace('/director', null, {shallow: true});
  }

  let successAlert = '';
  if (successMessage) {
    successAlert = (
      <div className={'alert alert-success alert-dismissible fade show mt-3 mb-0 d-flex align-items-center'} role={'alert'}>
        <i className={'bi-check-square pe-3'} aria-hidden={true}/>
        <span>
          {successMessage}
        </span>
        <button type={'button'}
                className={'btn-close'}
                data-bs-dismiss={'alert'}
                aria-label={'Close'}/>
      </div>
    );
  }

  return (
    <div>
      <Row>
        <Col xs={12} sm={{span: 8, offset: 2}} md={{span: 6, offset: 3}}>
          {successAlert}
          <LoginForm onLoginSuccess={onLoginSuccess} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={{span: 8, offset: 2}} md={{span: 6, offset: 3}}>
          <Card className={'border-0 text-center'}>
            <Card.Body>
              <Link href={'/'} className={'card-link'}>
                Tournio Home
              </Link>
              <Link href={'/director/forgot-password'} className={'card-link'}>
                Password Reset
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Login;
