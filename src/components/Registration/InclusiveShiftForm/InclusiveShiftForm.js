import classes from './InclusiveShiftForm.module.scss';
import React, {useEffect, useState} from "react";

const InclusiveShiftForm = ({shifts, value, onUpdate}) => {
  const initialState = {
    preferredShift: '',
  }
  const [componentState, setComponentState] = useState(initialState);

  useEffect(() => {
    if (!shifts) {
      return;
    }
    // Default the form's preferredShift value to the first shift, unless one was passed in
    const newFormValues = {...componentState };

    const availableShifts = shifts.filter(({isFull}) => !isFull)
    newFormValues.preferredShift = value ? value : availableShifts[0].identifier;
    setComponentState(newFormValues);
    onUpdate([newFormValues.preferredShift]);
  }, [shifts, value]);

  const inputChanged = (element) => {
    const newFormValues = {...componentState };
    newFormValues.preferredShift = element.target.value;
    setComponentState(newFormValues);

    onUpdate([newFormValues.preferredShift]);
  }

  return (
    <div className={classes.InclusiveShiftForm}>
      <div className={`${classes.FormElement}`}>
        <label className={`${classes.Label} col-form-label-lg`}>
          Shift Preference
        </label>
        <div className={`d-flex justify-content-evenly justify-content-lg-center`}>
          {shifts.map((shift, i) => {
            const selected = componentState.preferredShift === shift.identifier;
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
                       disabled={!!shift.isFull}
                       autoComplete={'off'}/>
                <label className={`btn btn-lg btn-tournio-radio`}
                       htmlFor={`preferredShift_${i}`}>
                  {!!shift.isFull ? '[full]' : ''} {shift.name}
                </label>
              </div>
            )})}
        </div>
      </div>
    </div>
  );
}

export default InclusiveShiftForm;
