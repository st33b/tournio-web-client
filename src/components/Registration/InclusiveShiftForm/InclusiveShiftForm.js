import classes from './InclusiveShiftForm.module.scss';
import React, {useEffect, useState} from "react";
import {devConsoleLog, updateObject} from "../../../utils";

const InclusiveShiftForm = ({shifts}) => {
  const initialFormValues = {
    fields: {
      preferredShift: '',
    },
    valid: false,
  }
  const [componentState, setComponentState] = useState({
    form: initialFormValues,
  });

  useEffect(() => {
    if (!shifts) {
      return;
    }
    // Default the form's preferredShift value to the first shift
    const newFormValues = {...componentState.form };
    newFormValues.fields.preferredShift = shifts[0].identifier;
    setComponentState(updateObject(componentState, {
      form: newFormValues,
    }));
  }, [shifts]);

  const isFormValid = (fields) => {
    return fields.preferredShift.length > 0;
  }

  const inputChanged = (element) => {
    const newFormValues = {...componentState.form };
    switch (element.target.name) {
      case 'preferredShift':
        newFormValues.fields[element.target.name] = element.target.value;
        break;
      default:
        return;
    }
    newFormValues.valid = isFormValid(newFormValues.fields);
    setComponentState(updateObject(componentState, {
      form: newFormValues,
    }));
  }

  return (
    <div className={classes.InclusiveShiftForm}>
      <div className={`${classes.FormElement}`}>
        <label className={`${classes.Label} col-form-label-lg`}>
          Shift Preference
        </label>
        <div className={`d-flex justify-content-evenly justify-content-lg-center`}>
          {shifts.map((shift, i) => {
            if (shift.is_full) {
              return '';
            }
            const selected = componentState.form.fields.preferredShift === shift.identifier;
            return (
              <div key={`preferredShiftInput${i}`}
                   className={`mx-lg-4 ${selected ? 'selected-radio-container' : ''}`}>
                <input type={'radio'}
                       className={'btn-check'}
                       name={'preferredShift'}
                       id={`preferredShift_${i}`}
                       value={shift.identifier}
                       onChange={inputChanged}
                       checked={selected}
                       autoComplete={'off'}/>
                <label className={`btn btn-lg btn-tournio-radio`}
                       htmlFor={`preferredShift_${i}`}>
                  {shift.name}
                </label>
              </div>
            )})}
        </div>
      </div>
    </div>
  );
}

export default InclusiveShiftForm;
