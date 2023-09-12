import React, {useEffect, useState} from "react";

import classes from './TeamForm.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import {updateObject} from "../../../utils";

const TeamForm = ({shifts=[], maxBowlers=4, onSubmit}) => {
  const initialFormValues = {
    fields: {
      bowlerCount: 4,
      name: '',
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

  const formHandler = (event) => {
    event.preventDefault();

    if (!componentState.form.valid) {
      return;
    }

    onSubmit(componentState.form.fields);
  }

  const isFormValid = (fields) => {
    return fields.bowlerCount > 0 && fields.bowlerCount <= maxBowlers
      && fields.name.length > 0
      && fields.preferredShift.length > 0;
  }

  const inputChanged = (element) => {
    const newFormValues = {...componentState.form };
    switch (element.target.name) {
      case 'bowlerCount':
        newFormValues.fields.bowlerCount = parseInt(element.target.value);
        break;
      case 'name':
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

  const bowlerCountRadios = [];
  for (let i = 0; i < maxBowlers; i++) {
    const selected = componentState.form.fields.bowlerCount === i+1;
    bowlerCountRadios.push(
      <div key={`bowlerCountInput${i+1}`} className={`mx-lg-4 ${selected ? 'selected-radio-container' : ''}`}>
        <input type={'radio'}
               className={'btn-check'}
               name={'bowlerCount'}
               id={`bowlerCount_${i+1}`}
               value={i+1}
               checked={selected}
               onChange={inputChanged}
               autoComplete={'off'} />
        <label className={`btn btn-lg btn-tournio-radio`}
               htmlFor={`bowlerCount_${i+1}`}>
          {i+1}
        </label>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`${classes.TeamForm}`}>
        {/* bowler count selector */}
        <div className={`${classes.FormElement}`}>
          <label className={`${classes.Label} col-form-label-lg`}>
            How many bowlers do you have?
          </label>
          <div className={`d-flex justify-content-evenly justify-content-lg-center`}>
            {bowlerCountRadios}
          </div>
        </div>

        {/* team name */}
        <div className={`${classes.FormElement}`}>
          <label className={'col-form-label-lg'}
                 htmlFor={'teamName'}>
            Team Name
          </label>
          <input type={'text'}
                 id={'teamName'}
                 name={'name'}
                 value={componentState.form.fields.name}
                 onChange={inputChanged}
                 aria-label={'Team Name'}
                 className={`form-control form-control-lg`}
                 placeholder={'... name ...'}
          />
        </div>

        {/* shift preference selector */}
        {shifts.length > 1 && (
          <div className={`${classes.FormElement}`}>
            <label className={`${classes.Label} col-form-label-lg`}>
              Shift Preference
            </label>
            <div className={`d-flex justify-content-evenly justify-content-lg-center`}>
              {shifts.map((shift, i) => {
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
        )}
        <div className={`${classes.Submit}`}>
          <button className={`btn btn-lg btn-success`}
                  onClick={formHandler}
                  role={'button'}>
            Go
            <i className={'bi bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </ErrorBoundary>
  )
};

export default TeamForm;
