import {useState} from 'react';
import {FloatingLabel, Form, Button} from "react-bootstrap";

import {updateObject} from "../../../utils";

import classes from './NewTeamForm.module.scss';
import {useRouter} from "next/router";
import {useDirectorContext} from "../../../store/DirectorContext";

const newTeamForm = ({submitted}) => {
  const directorContext = useDirectorContext();
  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }

  const initialState = {
    name: '',
  }
  const formClass = 'needs-validation';
  const [newTeamForm, setNewTeamForm] = useState(initialState);

  if (!identifier) {
    return '';
  }

  const formHandler = (event) => {
    event.preventDefault();

    submitted(newTeamForm.name);

    setNewTeamForm(initialState);
    event.target.className = formClass; // remove the 'was-validated' class from the form
  }

  const inputChangedHandler = (event) => {
    const enteredName = event.target.value;
    const newState = updateObject(newTeamForm, {
      name: enteredName,
    });
    setNewTeamForm(newState);
  }

  let formValue = '';
  if (newTeamForm) {
    formValue = newTeamForm.name;
  }

  let output = '';
  output = (
      <Form onSubmit={formHandler}
            noValidate
            className={formClass}>
        <FloatingLabel label={'Team Name'}
                       controlId={'name'}
                       className={'mb-3'}>
          <Form.Control type={'text'}
                        placeholder={'name'}
                        name={'name'}
                        value={formValue}
                        required
                        onChange={(event) => inputChangedHandler(event)}
          />
          <Form.Control.Feedback type={'invalid'}>
            Need a name here.
          </Form.Control.Feedback>
        </FloatingLabel>
        <Button type={'submit'} className={'btn btn-primary'}>
          Create
          <i className={[classes.CreateTeamButtonIcon, 'bi-chevron-right'].join(' ')} aria-hidden={'true'} />
        </Button>
      </Form>
  );

  return (
    <div className={classes.NewTeamForm}>
      {output}
    </div>
  );
}

export default newTeamForm;
