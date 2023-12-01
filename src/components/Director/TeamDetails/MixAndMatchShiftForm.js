import classes from './MixAndMatchShiftForm.module.scss';
import React, {useEffect, useState} from "react";
import ErrorBoundary from "../../common/ErrorBoundary";
import {devConsoleLog} from "../../../utils";

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

  return (
    <div className={classes.MixAndMatchShiftForm}>
      <ErrorBoundary>
        {Object.values(shiftsByEvent).map(eventGroup => {
          const eventString = eventGroup[0].event_string;
          return (
            <div className={'row mb-2'} key={`event_group_${eventString}`}>
              <label htmlFor={`shiftInput_${eventGroup}`}
                     className={'col-form-label col-form-label-lg text-sm-end col-12 col-sm-4'}>
                {eventGroup[0].group_title}
              </label>
              <div className={'col'}>
                {eventGroup.map(({identifier, name, description}) => {
                  const selected = shiftForm.fields[eventString] === identifier;

                  return (
                    <div key={`shiftInput_${identifier}`} className={`form-check`}>
                      <input type={'radio'}
                             className={'form-check-input'}
                             name={`${eventString}_shift`}
                             id={`shift_${identifier}`}
                             value={identifier}
                             onChange={(e) => inputUpdated(e, eventString)}
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
            </div>

          );
        })}
      </ErrorBoundary>
    </div>
  )
}

export default MixAndMatchShiftForm;
