import classes from './InclusiveShiftForm.module.scss';
import React, {useEffect, useState} from "react";

const InclusiveShiftForm = ({shifts, onUpdate}) => {
  const initialFormValues = {
    fields: {
      preferredShift: '',
    },
  }
  const [componentState, setComponentState] = useState(initialFormValues);

  useEffect(() => {
    if (!shifts) {
      return;
    }
    // Default the form's preferredShift value to the first shift
    const newFormValues = {...componentState };
    const availableShifts = shifts.filter(({is_full}) => !is_full)
    newFormValues.fields.preferredShift = availableShifts[0].identifier;
    setComponentState(newFormValues);
    onUpdate([newFormValues.fields.preferredShift]);
  }, [shifts]);

  const inputChanged = (element) => {
    const newFormValues = {...componentState };
    switch (element.target.name) {
      case 'preferredShift':
        newFormValues.fields[element.target.name] = element.target.value;
        break;
      default:
        return;
    }
    setComponentState(newFormValues);

    onUpdate([newFormValues.fields.preferredShift]);
  }

  return (
    <div className={classes.InclusiveShiftForm}>
      <div className={`${classes.FormElement}`}>
        <label className={`${classes.Label} col-form-label-lg`}>
          Shift Preference
        </label>
        <div className={`d-flex justify-content-evenly justify-content-lg-center`}>
          {shifts.map((shift, i) => {
            const selected = componentState.fields.preferredShift === shift.identifier;
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
                       disabled={!!shift.is_full}
                       autoComplete={'off'}/>
                <label className={`btn btn-lg btn-tournio-radio`}
                       htmlFor={`preferredShift_${i}`}>
                  {!!shift.is_full ? '[full]' : ''} {shift.name}
                </label>
              </div>
            )})}
        </div>
      </div>
    </div>
  );
}

export default InclusiveShiftForm;
