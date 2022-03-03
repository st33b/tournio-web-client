import {useState, useRef} from "react";
import {useRouter} from "next/router";

import axios from "axios";

import {Button, Card, FloatingLabel, Form} from "react-bootstrap";

import {useDirectorContext} from '../../../store/DirectorContext';
import {apiHost} from "../../../utils";

import classes from './LoginForm.module.scss';

const loginForm = () => {
  const router = useRouter();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [validated, setValidated] = useState(false);

  const directorContext = useDirectorContext();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (!enteredEmail || !enteredPassword) {
      setValidated(true);
      return;
    }

    setIsLoading(true);
    const url = `${apiHost}/login`;
    const postBody = {
      user: {
        email: enteredEmail,
        password: enteredPassword,
      }
    };
    axios.post(url, postBody)
      .then(response => {
        setIsLoading(false);
        setLoginFailed(false);
        const authHeader = response.headers.authorization;
        const userData = response.data;
        directorContext.login(authHeader, userData);

        router.push('/director')
      })
      .catch(error => {
        setIsLoading(false);
        setLoginFailed(true);
      });
  }

  return (
    <div className={classes.LoginForm}>
      <Card className={classes.Card + ' col-12 col-sm-8 col-md-6 offset-sm-2 offset-md-3'}>
        <Card.Header>
          <Card.Title>
            Let's get you logged in...
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
                Can't log in without an email.
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel label={'Password'}
                           controlId={'password'}>
              <Form.Control type={'password'}
                            required
                            placeholder={'Password'}
                            ref={passwordInputRef}/>
              <Form.Control.Feedback type={'invalid'}>
                Can't log in without a password.
              </Form.Control.Feedback>
            </FloatingLabel>
            <div className={classes.Actions}>
              {!isLoading && <Button variant={'primary'} type={'submit'}>Log In</Button>}
              {isLoading && <Button variant={'secondary'} disabled={true}>Logging you in...</Button>}
            </div>
          </Form>
        </Card.Body>
        {loginFailed && (
          <Card.Body className={'pt-0 text-center text-danger'}>
            Invalid username and/or password. Try again.
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default loginForm;