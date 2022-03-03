import {useRef, useState, useEffect} from "react";
import {Alert, Button, Card, FloatingLabel, Form, FormGroup} from "react-bootstrap";
import axios from "axios";
import {useRouter} from "next/router";

import {apiHost} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './UserForm.module.scss';

const userForm = ({user}) => {
  const directorContext = useDirectorContext();
  const router = useRouter();

  let formTitle = 'New User';
  let submitButtonText = 'Create User';
  let submittingButtonText = 'Creating...';

  let isSelf = false;

  const initialState = {
    fields: {
      email: '',
      role: 'director',
      tournamentIds: [],
    },
    valid: true,
    touched: false,
  }

  let areWeCreating = true;
  if (user) {
    areWeCreating = false;
    isSelf = user.identifier === directorContext.user.identifier;

    initialState.fields.email = user.email;
    initialState.fields.role = user.role;
    initialState.fields.tournamentIds = user.tournaments.map(t => t.id);

    if (isSelf) {
      delete initialState.fields.role;
      delete initialState.fields.tournamentIds;
    }

    formTitle = 'User Details';
    submitButtonText = 'Update';
    submittingButtonText = 'Updating...';
  }

  const emailInputRef = useRef();
  const roleInputRef = useRef();
  const tournamentsInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFormData, setUserFormData] = useState(initialState);
  const [banner, setBanner] = useState(null);

  // Retrieve list of available tournaments
  useEffect(() => {
    const theUrl = `${apiHost}/director/tournaments?upcoming`;
    const requestConfig = {
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      },
    }
    setIsLoading(true);
    axios.get(theUrl, requestConfig)
      .then(response => {
        setTournaments(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        if (error.response.status === 401) {
          directorContext.logout();
          router.push('/director/login');
        }
      });
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    let url = `${apiHost}/director/users`;
    let method = 'post';
    const userData = {
      email: enteredEmail,
    }

    if (!areWeCreating) {
      url += '/' + user.identifier;
      method = 'patch';
    }

    if (!isSelf) {
      const enteredRole = roleInputRef.current.value;

      const tournamentIds = [];
      for (const option of tournamentsInputRef.current.selectedOptions) {
        tournamentIds.push(option.value);
      }
      userData.role = enteredRole;
      userData.tournament_ids = tournamentIds;
    }

    const requestConfig = {
      url: url,
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      },
      method: method,
      data: {
        user: userData,
      }
    }

    setIsSubmitting(true);
    axios(requestConfig)
      .then(response => {
        setIsSubmitting(false);
        setBanner(<Alert variant={'success'}
                         className={'mt-3'}>{areWeCreating ? 'User has been created!' : 'User details updated.'}</Alert>);

        // Update the touch attribute in the userDataForm back to false.
        const updatedForm = {...userFormData};
        updatedForm.fields = {...userFormData.fields};
        updatedForm.touched = false;
        setUserFormData(updatedForm);

        // Call a passed-in "new user created" or "user updated" function
        // so that our parent page can update accordingly, if desired.
      })
      .catch(error => {
        setIsSubmitting(false);
        if (error.response.status === 401) {
          directorContext.logout();
          router.push('/director/login');
        }
        setBanner(<Alert variant={'danger'} className={'mt-3'}>Failed for some reason. :(</Alert>);
      });
  }

  const inputChangedHandler = (event, elementId) => {
    const updatedForm = {...userFormData};
    updatedForm.fields = {...userFormData.fields};

    const newValue = event.target.value;

    // This is the only validation we need to do
    if (elementId === 'email' && !newValue) {
      updatedForm.valid = false;
    }

    // Value of Tournament IDs element is handled differently than the others
    if (elementId === 'tournamentIds') {
      const tournamentIds = [];
      for (const option of tournamentsInputRef.current.selectedOptions) {
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

  let whatToDisplay = 'Retrieving list of tournaments...';
  if (!isLoading) {
    whatToDisplay = (
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
                        ref={emailInputRef}/>
          <Form.Control.Feedback type={'invalid'}>
            Gotta have a valid email address.
          </Form.Control.Feedback>
        </FormGroup>
        {!isSelf && (
          <FormGroup controlId={'role'} className={'mb-3'}>
            <Form.Label>
              Role
            </Form.Label>
            <Form.Select name={'role'}
                         ref={roleInputRef}
                         onChange={(event) => inputChangedHandler(event, 'role')}
                         defaultValue={userFormData.fields.role}>
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
        )}
        {!isSelf && (
          <FormGroup controlId={'tournamentIds'}>
            <Form.Label>
              Tournament(s)
            </Form.Label>
            <Form.Select name={'tournamentIds'}
                         multiple
                         ref={tournamentsInputRef}
                         htmlSize={Math.min(10, tournaments.length)}
                         onChange={(event) => inputChangedHandler(event, 'tournamentIds')}
                         defaultValue={userFormData.fields.tournamentIds}>
              {tournaments.map((t) => {
                return (
                  <option key={t.identifier} value={t.id}>
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
        {banner}
      </Form>
    );
  }
  return (
    <div className={classes.UserForm}>
      <Card className={classes.Card}>
        <Card.Header>
          <Card.Title>
            {formTitle}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {whatToDisplay}
        </Card.Body>
      </Card>
    </div>
  );
}

export default userForm;