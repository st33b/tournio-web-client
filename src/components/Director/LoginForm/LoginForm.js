import {useState, useRef} from "react";
import axios from "axios";
import {Button, Card, FloatingLabel, Form} from "react-bootstrap";

import {useLoginContext} from "../../../store/LoginContext";
import {apiHost} from "../../../utils";

import classes from './LoginForm.module.scss';

const LoginForm = ({onLoginSuccess}) => {
  const {login} = useLoginContext();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const loginFailure = (error) => {
    setLoading(false);
    setErrorMessage(error);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (!enteredEmail || !enteredPassword) {
      setValidated(true);
      return;
    }

    setLoading(true);
    const userCreds = {
      user: {
        email: enteredEmail,
        password: enteredPassword,
      }
    };

    const config = {
      url: `${apiHost}/login`,
      headers: {
        'Accept': 'application/json',
      },
      method: 'post',
      data: userCreds,
      validateStatus: (status) => { return status < 500 },
    };
    axios(config)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          login(response.data, response.headers.authorization);
          onLoginSuccess();
        } else {
          loginFailure('Invalid email/password combination.');
        }
      })
      .catch(error => {
        loginFailure(error);
      });
  }

  return (
    <div className={classes.LoginForm}>
      <Card className={classes.Card}>
        <Card.Header>
          <Card.Title>
            Let&apos;s get you logged in...
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={submitHandler} noValidate validated={validated}>
            <FloatingLabel label={'Email address'}
                           className={'mb-3'}
                           controlId={'emailAddress'}>
              <Form.Control type={'email'}
                            required
                            placeholder={'name@example.com'}
                            ref={emailInputRef}/>
              <Form.Control.Feedback type={'invalid'}>
                Can&apos;t log in without an email.
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel label={'Password'}
                           controlId={'password'}>
              <Form.Control type={'password'}
                            required
                            placeholder={'Password'}
                            autoComplete={'current-password'}
                            ref={passwordInputRef}/>
              <Form.Control.Feedback type={'invalid'}>
                Can&apos;t log in without a password.
              </Form.Control.Feedback>
            </FloatingLabel>
            <div className={classes.Actions}>
              {!loading && <Button variant={'primary'} type={'submit'}>Log In</Button>}
              {loading && (
                <Button variant={'secondary'} disabled={true}>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {' '}Logging you in...
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
        {errorMessage && (
          <Card.Body className={'pt-0 text-center text-danger'}>
            {errorMessage}
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default LoginForm;
