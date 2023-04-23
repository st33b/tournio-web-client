import {Col, Form, Row} from "react-bootstrap";

import classes from './ShiftForm.module.scss';
import React from "react";

const ShiftForm = ({tournament, onInputChanged, currentSelection, name='shift'}) => {
  const FULL_FORM = 'multi';
  const ONE_LEFT = 'oneLeft';

  let formToDisplay = false;
  if (tournament.available_shifts.length > 1) {
    formToDisplay = FULL_FORM;
  } else if (tournament.shifts.length > 1) {
    formToDisplay = ONE_LEFT;
  }

  return (
    <div className={classes.ShiftForm}>
      {formToDisplay === FULL_FORM && (
        <Form.Group as={Row}
                    className={'my-3'}
                    controlId={'shift'}>
          <Form.Label column={true}
                      className={classes.Label}
                      md={4}>
            Shift Preference
            <i className={`${classes.NoteIndicator} align-top bi-asterisk ms-1`} aria-hidden={true} />
          </Form.Label>
          <Col>
            {tournament.available_shifts.map((shift, i) => (
              <Form.Check type={'radio'}
                          key={i}
                          required={true}
                          onChange={onInputChanged}
                          label={shift.name}
                          value={shift.identifier}
                          checked={currentSelection === shift.identifier}
                          id={`${name}_${i}`}
                          name={name} />
            ))}
            <div className={classes.ConfirmationText}>
              <i className={`${classes.NoteIndicator} align-top bi-asterisk me-1`} aria-hidden={true} />
              A bowler&apos;s place in a shift cannot be confirmed until they have paid their registration fees.
            </div>
          </Col>
        </Form.Group>
      )}
      {formToDisplay === ONE_LEFT && (
        <Form.Group as={Row}
                    className={'mb-3'}
                    controlId={'shift'}>
          <Form.Label column={true}
                      className={classes.Label}
                      md={4}>
            Shift Preference
          </Form.Label>
          <Col>
          <span className={`${classes.OneShift} align-middle`}>
            The only remaining available shift is <strong>{shiftName}</strong>.
          </span>
          </Col>
        </Form.Group>
      )}
    </div>
  );
}

export default ShiftForm;
