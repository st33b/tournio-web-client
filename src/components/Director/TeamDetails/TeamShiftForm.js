import React, {useEffect, useState} from "react";

import classes from './TeamShiftForm.module.scss';

const TeamShiftForm = ({allShifts, team, shift, onShiftChange}) => {
  const initialFormData = {
    fields: {
      shift_identifier: '',
    }
  }

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!allShifts || !team) {
      return;
    }
    if (!shift) {
      return;
    }
    const newFormData = {...formData}
    newFormData.fields.shift_identifier = shift.identifier;
    setFormData(newFormData);
  }, [allShifts, team, shift]);

  const shiftChosen = (event) => {
    const newShiftIdentifier = event.target.value;
    const newFormData = {...formData};
    newFormData.fields.shift_identifier = newShiftIdentifier;
    setFormData(newFormData);

    onShiftChange(newShiftIdentifier);
  }

  if (!team || !shift || !allShifts) {
    return '';
  }

  ///////////////////////////////////////

  return (
    <div className={classes.TeamShiftForm}>
      {!shift && <p>n/a</p>}
      {shift && allShifts.map((s, i) => {
          const selected = formData.fields.shift_identifier === s.identifier;

          return (
            <div key={`shiftInput_${i}`} className={`form-check`}>
              <input type={'radio'}
                     className={'form-check-input'}
                     name={`shift_${s.identifier}`}
                     id={`shift_${s.identifier}`}
                     value={s.identifier}
                     onChange={shiftChosen}
                     checked={selected}
                     autoComplete={'off'}/>
              <label className={`form-check-label`}
                     htmlFor={`shift_${s.identifier}`}>
                {s.name}: {s.description}
              </label>
            </div>
          );
      })}
    </div>
  );
}

export default TeamShiftForm;
