import {useState} from "react";
import {FloatingLabel, Form, Button} from "react-bootstrap";
import {updateObject} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './NewFreeEntryForm.module.scss';

const newFreeEntryForm = ({submitted}) => {
  const directorContext = useDirectorContext();

  const initialState = {
    freeEntryCode: '',
  }

  const formClass = 'needs-validation';

  const [freeEntryForm, setFreeEntryForm] = useState(initialState);

  const formHandler = (event) => {
    event.preventDefault();
    submitted(freeEntryForm.freeEntryCode);
    setFreeEntryForm(initialState);
    event.target.className = formClass; // remove the 'was-validated' class from the form
  }

  const inputChangedHandler = (event) => {
    const enteredCode = event.target.value;
    const newState = updateObject(freeEntryForm, {
      freeEntryCode: enteredCode,
    });
    setFreeEntryForm(newState);
  }

  if (!directorContext || !freeEntryForm) {
    return '';
  }

  return (
    <div className={classes.NewFreeEntryForm}>
      <Form onSubmit={formHandler}
            noValidate
            className={formClass}>
        <FloatingLabel label={'Unique Code'}
                       controlId={'unique_code'}
                       className={'mb-3'}>
          <Form.Control type={'text'}
                        placeholder={'unique code'}
                        name={'unique_code'}
                        value={freeEntryForm.freeEntryCode}
                        required
                        onChange={(event) => inputChangedHandler(event)}
          />
          <Form.Control.Feedback type={'invalid'}>
            Need a code here.
          </Form.Control.Feedback>
        </FloatingLabel>
        <Button type={'submit'} className={'btn btn-primary'}>
          Create
          <i className={[classes.CreateEntryButtonIcon, 'bi-chevron-right'].join(' ')} aria-hidden={'true'} />
        </Button>
      </Form>

    </div>
  );
}

export default newFreeEntryForm;