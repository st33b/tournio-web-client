import {useState, useRef} from "react";
import {useRouter} from "next/router";
import {Button, Card, FloatingLabel, Form} from "react-bootstrap";

import {directorResetPasswordRequest} from "../../../utils";

import classes from './PasswordResetForm.module.scss';

const passwordResetForm = ({token}) => {
  const router = useRouter();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!token) {
    return '';
  }

  const formSubmitSuccess = (data) => {
    setLoading(false);
    // Now we can log in with the new password.
    router.push('/director/login?password_reset_success=true');
  }

  const formSubmitFailure = (data) => {
    setLoading(false);
    setErrorMessage(data);
  }

  const validate = (password, confirm) => {
    return (password === confirm && password.length >= 8)
  }

  const submitHandler = (event) => {
    event.preventDefault();
    const password = passwordInputRef.current.value;
    const passwordConfirm = passwordConfirmInputRef.current.value;

    if (!validate(password, passwordConfirm)) {
      setValidated(true);
      return;
    }

    setLoading(true);
    const postData = {
      user: {
        password: password,
        password_confirmation: passwordConfirm,
        reset_password_token: token,
      }
    };
    directorResetPasswordRequest(postData, formSubmitSuccess, formSubmitFailure);
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
    <div className={classes.PasswordResetForm}>
      <Card className={classes.Card}>
        <Card.Header>
          <Card.Title>
            Choose your new password
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={submitHandler} noValidate validated={validated}>
            <FloatingLabel label={'Password'}
                           className={'mb-3'}
                           controlId={'password'}>
              <Form.Control type={'password'}
                            required
                            placeholder={'Password'}
                            ref={passwordInputRef}/>
              <Form.Control.Feedback type={'invalid'}>
                Password's gotta be at least 8 characters long.
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel label={'Confirm Password'}
                           controlId={'password_confirmation'}>
              <Form.Control type={'password'}
                            required
                            placeholder={'Confirm Password'}
                            ref={passwordConfirmInputRef}/>
              <Form.Control.Feedback type={'invalid'}>
                Passwords gotta match.
              </Form.Control.Feedback>
            </FloatingLabel>
            <div className={classes.Actions}>
              {!loading && <Button variant={'primary'} type={'submit'}>Submit</Button>}
              {loading && <Button variant={'secondary'} disabled={true}>Submitting...</Button>}
            </div>
            {displayedError}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default passwordResetForm;