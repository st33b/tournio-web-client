
import {Button, Card, FloatingLabel, Form, FormGroup} from "react-bootstrap";

import classes from './UserForm.module.scss';
import {useRef, useState} from "react";

const userForm = () => {
  const emailInputRef = useRef();
  const roleInputRef = useRef();
  const tournamentsInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();

    // ...
  }
  return (
    <div className={classes.UserForm}>
      <Card className={classes.Card}>
        <Card.Header>
          <Card.Title>
            New User
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form noValidate onSubmit={submitHandler}>
            <FormGroup controlId={'emailAddress'} className={'mb-3'}>
              <Form.Label>
                Email Address
              </Form.Label>
              <Form.Control type={'email'}
                            required
                            placeholder={'name@domain.com'}
                            ref={emailInputRef} />
              <Form.Control.Feedback type={'invalid'}>
                Gotta have an email address.
              </Form.Control.Feedback>
            </FormGroup>
            <FormGroup controlId={'role'} className={'mb-3'}>
              <Form.Label>
                Role
              </Form.Label>
              <Form.Select name={'role'} ref={roleInputRef} value={'director'}>
                <option value={'superuser'}>
                  Superuser
                </option>
                <option value={'director'}>
                  Director
                </option>
                <option value={'unpermitted'}>
                  No role yet
                </option>
              </Form.Select>
            </FormGroup>
            <FormGroup controlId={'tournament_ids'}>
              <Form.Label>
                Tournament(s)
              </Form.Label>
              <Form.Select name={'tournament_ids'} multiple ref={tournamentsInputRef}>
                <option>
                  TBD...
                </option>
              </Form.Select>
            </FormGroup>
            <div className={classes.Actions}>
              {!isLoading && <Button variant={'primary'} type={'submit'}>Create User</Button>}
              {isLoading && <Button variant={'secondary'} disabled={true}>Creating...</Button>}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default userForm;