import DirectorLayout from '../../components/Layout/DirectorLayout/DirectorLayout';
import LoginForm from '../../components/Director/LoginForm/LoginForm';
import {Col, Row} from "react-bootstrap";

const login = () => {
  return (
    <div>
      <LoginForm />
      <Row>
        <Col>
          <p className={'text-center'}>
            <a href={'/'}>
              Registration Home
            </a>
          </p>
        </Col>
      </Row>
    </div>
  );
}

login.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default login;