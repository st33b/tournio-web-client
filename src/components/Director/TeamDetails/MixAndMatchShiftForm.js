import classes from './MixAndMatchShiftForm.module.scss';
import React, {useEffect, useState} from "react";
import ErrorBoundary from "../../common/ErrorBoundary";

const MixAndMatchShiftForm = ({shiftsByEvent = {}, currentShifts = [], onUpdate}) => {
  const initialFormValues = {
    fields: {},
  };

  const [shiftForm, setShiftForm] = useState(initialFormValues);

  useEffect(() => {
    if (!currentShifts) {
      return;
    }
    const updatedForm = {
      ...shiftForm,
      fields: {},
    };
    for (const shift of currentShifts) {
      updatedForm.fields[shift.event_string] = shift.identifier;
    }
    setShiftForm(updatedForm);
    onUpdate(Object.values(updatedForm.fields)); // Make sure our parent component is consistent
  }, [currentShifts]);

  const inputUpdated = (event, groupString) => {
    // Update the component's state
    const updatedForm = {...shiftForm};
    updatedForm.fields[groupString] = event.target.value;
    setShiftForm(updatedForm);

    // // Now convey that to our parent
    const shiftIdentifiers = Object.values(updatedForm.fields);
    onUpdate(shiftIdentifiers);
  }

  {/* A set of radios for each event set */}
  const groups = [];
  for (const eventGroup in shiftsByEvent) {
    groups.push(
      <div className={classes.EventGroup} key={eventGroup}>
        <h6>
          {shiftsByEvent[eventGroup][0].group_title}
        </h6>

        {shiftsByEvent[eventGroup].map(({identifier, name, description}) => {
          const selected = shiftForm.fields[eventGroup] === identifier;

          return (
            <div key={`shiftInput_${identifier}`} className={`mx-lg-4 mb-1 form-check`}>
              <input type={'radio'}
                     className={'form-check-input'}
                     name={`${eventGroup}_shift`}
                     id={`shift_${identifier}`}
                     value={identifier}
                     onChange={(e) => inputUpdated(e, eventGroup)}
                     checked={selected}
                     autoComplete={'off'}/>
              <label className={`form-check-label`}
                     htmlFor={`shift_${identifier}`}>
                {name}: {description}
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={classes.MixAndMatchShiftForm}>
      <ErrorBoundary>
        <form noValidate={true}>
          {groups}
        </form>
      </ErrorBoundary>
    </div>
  )
}

export default MixAndMatchShiftForm;
