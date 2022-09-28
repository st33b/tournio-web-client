import React, {useState, useEffect} from "react";
import {Alert, Button, Card, Form, FormGroup} from "react-bootstrap";
import {useRouter} from "next/router";

import {directorApiRequest} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './UserForm.module.scss';
import {userAdded, userDeleted, userUpdated} from "../../../store/actions/directorActions";

const UserForm = ({user, tournaments}) => {
  const context = useDirectorContext();
  const {dispatch, directorState} = context;
  const router = useRouter();

  const initialState = {
    fields: {
      email: '',
      role: 'director',
      first_name: '',
      last_name: '',
      tournamentIds: [],
    },
    valid: false,
    touched: false,
  };

  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFormData, setUserFormData] = useState(initialState);
  const [banner, setBanner] = useState(null);

  // If we're editing an existing user, then put the existing user's values into the form
  useEffect(() => {
    if (!user) {
      return;
    }

    const newUserFormData = {...userFormData};

    newUserFormData.fields.email = user.email;
    newUserFormData.fields.role = user.role;
    newUserFormData.fields.first_name = user.first_name;
    newUserFormData.fields.last_name = user.last_name;
    newUserFormData.fields.tournamentIds = user.tournaments.map(t => t.id);

    const isSelf = user.identifier === directorState.user.identifier;
    if (isSelf) {
      delete newUserFormData.fields.role;
      delete newUserFormData.fields.tournamentIds;
    }

    newUserFormData.valid = true;

    setUserFormData(newUserFormData);
  }, [user, directorState.user]);

  if (!directorState.user) {
    return '';
  }

  let areWeCreating = true;
  let deleteButton = '';
  let isSelf = false;
  let formTitle = 'New User';
  let submitButtonText = 'Create User';
  let submittingButtonText = 'Creating...';

  const onDeleteSuccess = (_) => {
    dispatch(userDeleted(user));
    router.push('/director/users?success=deleted');
  }

  const onDeleteFailure = (data) => {
    setErrorMessage(`Failed to delete user. ${data.error}`);
  }

  const deleteInitiated = (e) => {
    e.preventDefault();
    if (confirm('This will remove the user and their ability to administer any tournaments. Are you sure?')) {
      const uri = `/director/users/${user.identifier}`;
      const requestConfig = {
        method: 'delete',
      }
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        context: context,
        onSuccess: onDeleteSuccess,
        onFailure: onDeleteFailure,
      });
    }
  }

  if (user) {
    areWeCreating = false;
    isSelf = user.identifier === directorState.user.identifier;

    formTitle = 'User Details';
    submitButtonText = 'Update';
    submittingButtonText = 'Updating...';

    if (!isSelf) {
      deleteButton = (
        <Card className={'mt-3'}>
          <Card.Body className={'text-center'}>
            <Button variant={'danger'}
                    type={'submit'}
                    onClick={deleteInitiated}
            >
              Delete User
            </Button>
          </Card.Body>
        </Card>
      );
    }
  }

  const onSubmitSuccess = (data) => {
    setIsSubmitting(false);
    setBanner(<Alert variant={'success'}
                     dismissible={true}
                     onClose={() => setBanner(null)}
                     className={'mt-3 mb-0'}>{areWeCreating ? 'User has been created!' : 'User details updated.'}</Alert>);

    // Call a passed-in "new user created" or "user updated" function
    // so that our parent page can update accordingly, if desired.
    if (areWeCreating) {
      dispatch(userAdded(data));
      setUserFormData(initialState);
      setSuccessMessage('User created.');
    } else {
      dispatch(userUpdated(data));
      setSuccessMessage('User details updated');

      // Update the touched attribute in the userDataForm back to false.
      const updatedForm = {...userFormData};
      updatedForm.fields = {...userFormData.fields};
      updatedForm.touched = false;
      setUserFormData(updatedForm);
    }
  }

  const onSubmitFailure = (data) => {
    setIsSubmitting(false);
    setErrorMessage(`Failed to save. ${data.error}`);
  }

  const submitHandler = (event) => {
    event.preventDefault();

    let uri = `/director/users`;
    let method = 'post';
    const userData = {
      email: userFormData.fields.email,
      first_name: userFormData.fields.first_name,
      last_name: userFormData.fields.last_name,
    }

    if (!areWeCreating) {
      uri += `/${user.identifier}`;
      method = 'patch';
    }

    if (!isSelf) {
      const tournamentIds = [];
      for (const option of userFormData.fields.tournamentIds) {
        tournamentIds.push(option);
      }
      userData.role = userFormData.fields.role;
      userData.tournament_ids = tournamentIds;
    }

    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method,
      data: {
        user: userData,
      }
    }

    setIsSubmitting(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: onSubmitSuccess,
      onFailure: onSubmitFailure,
    });
  }

  const inputChangedHandler = (event, elementId) => {
    const updatedForm = {...userFormData};
    updatedForm.fields = {...userFormData.fields};

    const newValue = event.target.value;

    // This is the only validation we need to do
    if (elementId === 'email') {
      updatedForm.valid = !!newValue;
    }

    // Value of Tournament IDs element is handled differently than the others
    if (elementId === 'tournamentIds') {
      const tournamentIds = [];
      for (const option of event.target.selectedOptions) {
        tournamentIds.push(option.value);
      }
      updatedForm.fields.tournamentIds = tournamentIds;
    } else {
      updatedForm.fields[elementId] = newValue;
    }

    // No matter what, the form has been updated, so mark it as touched.
    updatedForm.touched = true;

    // Put the updates into state
    setUserFormData(updatedForm);
  }

  const success = successMessage && (
    <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
      <i className={'bi-check-lg pe-2'} aria-hidden={true} />
      <div className={'me-auto'}>
        {successMessage}
      </div>
      <button type={"button"}
              className={"btn-close"}
              data-bs-dismiss={"alert"}
              onClick={() => setSuccessMessage(null)}
              aria-label={"Close"} />
    </div>
  );
  const error = errorMessage && (
    <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
      <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
      <div className={'me-auto'}>
        <strong>
          Oh no!
        </strong>
        {' '}{errorMessage}
      </div>
      <button type={"button"}
              className={"btn-close"}
              data-bs-dismiss={"alert"}
              onClick={() => setErrorMessage(null)}
              aria-label={"Close"} />
    </div>
  );

  return (
    <div className={classes.UserForm}>
      <Card className={classes.Card}>
        <Card.Header>
          <Card.Title>
            {formTitle}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form noValidate onSubmit={submitHandler} validated={userFormData.touched}>
            <FormGroup controlId={'emailAddress'} className={'mb-3'}>
              <Form.Label>
                Email Address
              </Form.Label>
              <Form.Control type={'email'}
                            required
                            value={userFormData.fields.email}
                            placeholder={'name@domain.com'}
                            onChange={(event) => inputChangedHandler(event, 'email')}
              />
              <Form.Control.Feedback type={'invalid'}>
                Gotta have a valid email address.
              </Form.Control.Feedback>
            </FormGroup>
            <FormGroup controlId={'firstName'} className={'mb-3'}>
              <Form.Label>
                First Name
              </Form.Label>
              <Form.Control type={'text'}
                            value={userFormData.fields.first_name}
                            onChange={(event) => inputChangedHandler(event, 'first_name')}
              />
            </FormGroup>
            <FormGroup controlId={'lastName'} className={'mb-3'}>
              <Form.Label>
                Last Name
              </Form.Label>
              <Form.Control type={'text'}
                            value={userFormData.fields.last_name}
                            onChange={(event) => inputChangedHandler(event, 'last_name')}
              />
            </FormGroup>
            {!isSelf && (
              <FormGroup controlId={'role'} className={'mb-3'}>
                <Form.Label>
                  Role
                </Form.Label>
                <Form.Select name={'role'}
                             onChange={(event) => inputChangedHandler(event, 'role')}
                             value={userFormData.fields.role}>
                  {['superuser', 'director', 'unpermitted'].map((role) => (
                    <option value={role}
                            key={role}
                    >
                      {role}
                    </option>
                  ))};
                </Form.Select>
              </FormGroup>
            )}
            {!isSelf && (
              <FormGroup controlId={'tournamentIds'}>
                <Form.Label>
                  Tournament(s)
                </Form.Label>
                <Form.Select name={'tournamentIds'}
                             multiple
                             htmlSize={Math.min(10, tournaments.length)}
                             onChange={(event) => inputChangedHandler(event, 'tournamentIds')}
                             value={userFormData.fields.tournamentIds}>
                  {tournaments.map((t) => {
                    return (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.year})
                      </option>
                    );
                  })}
                </Form.Select>
              </FormGroup>
            )}
            <div className={classes.Actions}>
              {!isSubmitting && (
                <Button variant={'primary'}
                        type={'submit'}
                        disabled={!userFormData.touched || !userFormData.valid}>
                  {submitButtonText}
                </Button>
              )}
              {isSubmitting && <Button variant={'secondary'} disabled={true}>{submittingButtonText}</Button>}
            </div>
            {success}
            {error}
          </Form>
        </Card.Body>
      </Card>
      {deleteButton}
    </div>
  );
}

export default UserForm;