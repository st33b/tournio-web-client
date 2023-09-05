import {useEffect, useState} from 'react';
import {FloatingLabel, Form, Button, Row, Col} from "react-bootstrap";

import {devConsoleLog, updateObject} from "../../../utils";

import classes from './NewTeamForm.module.scss';

const NewTeamForm = ({allShifts=[], submitted}) => {
  const initialState = {
    fields: {
      name: '',
      shift_identifier: '',
    },
    valid: false,
  }
  const [newTeamForm, setNewTeamForm] = useState(initialState);

  useEffect(() => {
    if (!allShifts) {
      return;
    }
    setNewTeamForm(updateObject(newTeamForm, {
      fields: {
        name: newTeamForm.fields.name,
        shift_identifier: allShifts[0].identifier,
      },
    }));
  }, [allShifts]);

  const formHandler = (event) => {
    event.preventDefault();

    submitted(newTeamForm.fields);
    devConsoleLog("Resetting the team form");

    setNewTeamForm(updateObject(newTeamForm, {
      fields: {
        name: '',
        shift_identifier: allShifts[0].identifier,
      },
    }));
  }

  const inputChangedHandler = (event) => {
    const enteredName = event.target.value;
    const isValid = enteredName.length > 0;
    const newState = updateObject(newTeamForm, {
      fields: updateObject(newTeamForm.fields, {
        name: enteredName,
      }),
      valid: isValid,
    });
    setNewTeamForm(newState);
  }

  const shiftChosen = (event) => {
    const newShiftIdentifier = event.target.value;
    const newFormData = {...newTeamForm};
    newFormData.fields.shift_identifier = newShiftIdentifier;
    setNewTeamForm(newFormData);
  }

  return (
    <div className={classes.NewTeamForm}>
      <Form onSubmit={formHandler}>
        <FloatingLabel label={'Team Name'}
                       controlId={'name'}
                       className={'mb-3'}>
          <Form.Control type={'text'}
                        placeholder={'name'}
                        name={'name'}
                        value={newTeamForm.fields.name}
                        onChange={(event) => inputChangedHandler(event)}
          />
        </FloatingLabel>

        {allShifts.length > 1 && allShifts.map((shift, i) => (
            <Form.Check type={'radio'}
                        key={i}
                        onChange={shiftChosen}
                        label={shift.name}
                        value={shift.identifier}
                        checked={newTeamForm.fields.shift_identifier === shift.identifier}
                        id={`shift_${i}`}
                        name={'shift'} />
          )
        )}

        <Row>
          <Col className={'text-end'}>
            <Button type={'submit'}
                    disabled={!newTeamForm.valid}
                    className={'btn btn-primary'}>
              Create
              <i className={[classes.CreateTeamButtonIcon, 'bi-chevron-right'].join(' ')} aria-hidden={'true'} />
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default NewTeamForm;
