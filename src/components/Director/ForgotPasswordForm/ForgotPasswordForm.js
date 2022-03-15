import {useState, useRef} from "react";
import {Button, Card, FloatingLabel, Form} from "react-bootstrap";

import {directorForgotPasswordRequest} from "../../../utils";

import classes from './ForgotPasswordForm.module.scss';

const forgotPasswordForm = () => {
  const emailInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [resetInitiated, setResetInitiated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const formSubmitSuccess = () => {
    setLoading(false);
    setResetInitiated(true);
  }

  const formSubmitFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;

    if (!enteredEmail) {
      setValidated(true);
      return;
    }

    setLoading(true);
    const postData = {
      user: {
        email: enteredEmail,
      }
    };
    directorForgotPasswordRequest(postData, formSubmitSuccess, formSubmitFailure);
  }

  let initiatedMessage = '';
  if (resetInitiated) {
    initiatedMessage = (
      <div className={'alert alert-success alert-dismissible fade show mt-3 mb-0 d-flex align-items-center'} role={'alert'}>
        <i className={'bi-envelope-check pe-3'} aria-hidden={true}/>{' '}
        Check your email for instructions on resetting your password. The link contained in the email
        will expire in six hours.
        <button type={'button'}
                className={'btn-close'}
                data-bs-dismiss={'alert'}
                onClick={() => setResetInitiated(false)}
                aria-label={'Close'}/>
      </div>
    );
  }

  let displayedError = '';
  if (errorMessage) {
    displayedError = (
      <div className={'alert alert-danger alert-dismissible fade show mt-3 mb-0'} role={'alert'}>
        <i className={'bi-exclamation-triangle-fill'} aria-hidden={true} />{' '}
        {errorMessage}
        <button type={'button'} className={'btn-close'} data-bs-dismiss={'alert'} aria-label={'Close'} />
      </div>
    );
  }

  return (
    <div className={classes.ForgotPasswordForm}>
      <Card className={classes.Card}>
        <Card.Header>
          <Card.Title>
            Let's reset your password...
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={submitHandler} noValidate validated={validated}>
            <FloatingLabel label={'Email address'}
                           controlId={'emailAddress'}>
              <Form.Control type={'email'}
                            required
                            placeholder={'name@example.com'}
                            ref={emailInputRef}/>
              <Form.Control.Feedback type={'invalid'}>
                Can't reset your password without an email.
              </Form.Control.Feedback>
            </FloatingLabel>
            <div className={classes.Actions}>
              {!loading && <Button variant={'primary'} type={'submit'}>Reset</Button>}
              {loading && <Button variant={'secondary'} disabled={true}>Initiating password reset...</Button>}
            </div>
            {initiatedMessage}
            {displayedError}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default forgotPasswordForm;