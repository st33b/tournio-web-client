import {useState, useRef, useContext} from "react";
import {useHistory} from 'react-router-dom';

import {Button, Card, FloatingLabel, Form} from "react-bootstrap";

import AuthContext from '../../store/AuthContext';

import classes from './LoginForm.module.scss';

const LoginForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    // make request to server
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
          <Form onSubmit={submitHandler}>
            <FloatingLabel label={'Email address'}
                           className={'mb-3'}
                           controlId={'emailAddress'}>
              <Form.Control type={'email'}
                            placeholder={'name@example.com'}
                            ref={emailInputRef} />
            </FloatingLabel>
            <FloatingLabel label={'password'}
                           controlId={'password'}>
              <Form.Control type={'password'}
                            placeholder={'Password'}
                            ref={passwordInputRef} />
            </FloatingLabel>
            <div className={classes.Actions}>
              {!isLoading && <Button variant={'primary'} type={'submit'}>Log In</Button> }
              {isLoading && <Button variant={'secondary'} disabled={true}>Logging you in...</Button> }
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}