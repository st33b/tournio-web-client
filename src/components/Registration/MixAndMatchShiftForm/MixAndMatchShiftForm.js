import classes from './MixAndMatchShiftForm.module.scss';
import React, {useEffect, useState} from "react";
import {devConsoleLog, updateObject} from "../../../utils";

const MixAndMatchShiftForm = ({shiftsByEvent, onUpdate}) => {
  const initialFormValues = {
    fields: {
    },
  }

  const [componentState, setComponentState] = useState(initialFormValues);

  useEffect(() => {
    if (!shiftsByEvent) {
      return;
    }
    // Set the form to select the first (available) shift in each group
    const formValues = {...initialFormValues}
    for (const eventStr in shiftsByEvent) {
      formValues.fields[eventStr] = shiftsByEvent[eventStr][0].identifier;
      devConsoleLog("Event string:", eventStr);
      devConsoleLog("Initial value:", formValues.fields[eventStr]);
    }
    setComponentState(updateObject(componentState, {
        fields: {
          ...formValues.fields
        }
      }));
  }, [shiftsByEvent]);

  /////////////////////////////

  const inputUpdated = (event, groupString) => {
    // Update the component's state
    const updatedFields = {...componentState.fields}
    updatedFields[groupString] = event.target.value;
    setComponentState(updateObject(componentState, {
      fields: updatedFields,
    }));
  }

  {/* A set of radios for each event set */}
  const groups = [];
  for (const eventGroup in shiftsByEvent) {
    groups.push(
      <div className={classes.EventGroup} key={eventGroup}>
        <h4>
          {eventGroup}
        </h4>

        {shiftsByEvent[eventGroup].map(({identifier, name, description}) => {
          const selected = componentState.fields[eventGroup] === identifier;

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
      <h3>
        Shift Preferences
      </h3>
      {groups}
    </div>
  );
}

export default MixAndMatchShiftForm;
