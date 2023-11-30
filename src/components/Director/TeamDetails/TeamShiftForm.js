import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useClientReady} from "../../../utils";

import classes from './TeamShiftForm.module.scss';

const TeamShiftForm = ({allShifts, team, shift, onShiftChange}) => {
  const initialFormData = {
    valid: false,
    fields: {
      shift_identifier: '',
    }
  }

  const [formData, setFormData] = useState(initialFormData);

  const isValid = (identifier) => {
    return identifier.length > 0;
  }

  useEffect(() => {
    if (!allShifts || !team) {
      return;
    }
    if (!shift) {
      return;
    }
    const newFormData = {...formData}
    newFormData.fields.shift_identifier = shift.identifier;
    newFormData.valid = isValid(shift.identifier);
    setFormData(newFormData);
  }, [allShifts, team, shift]);

  const shiftChosen = (event) => {
    const newShiftIdentifier = event.target.value;
    const newFormData = {...formData};
    newFormData.fields.shift_identifier = newShiftIdentifier;
    newFormData.valid = isValid(newShiftIdentifier);
    setFormData(newFormData);
  }

  const submitClicked = (e) => {
    e.preventDefault();
    onShiftChange(formData.fields.shift_identifier);
  }

  const ready = useClientReady();
  if (!ready) {
    return '';
  }

  return (
    <div className={classes.TeamShiftForm}>
      {!shift && <p>n/a</p>}
      {shift && (
        <Form onSubmit={submitClicked} noValidate={true}>
          {allShifts.map((s, i) => (
              <Form.Check type={'radio'}
                          key={i}
                          onChange={shiftChosen}
                          label={s.name}
                          value={s.identifier}
                          checked={formData.fields.shift_identifier === s.identifier}
                          id={`shift_${i}`}
                          name={'shift'} />
            )
          )}
        </Form>
      )}
    </div>
  );
}

export default TeamShiftForm;
