import React, {useState} from "react";

import classes from './TeamForm.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import InclusiveShiftForm from "../InclusiveShiftForm/InclusiveShiftForm";
import MixAndMatchShiftForm from "../MixAndMatchShiftForm/MixAndMatchShiftForm";

const TeamForm = ({tournament, maxBowlers=4, onSubmit}) => {
  const initialFormValues = {
    fields: {
      bowlerCount: 4,
      name: '',
      shiftIdentifiers: [],
    },
    valid: false,
  }
  const [componentState, setComponentState] = useState(initialFormValues);

  const formHandler = (event) => {
    event.preventDefault();

    if (!componentState.valid) {
      return;
    }

    onSubmit(componentState.fields);
  }

  const isFormValid = (fields) => {
    return fields.bowlerCount > 0 && fields.bowlerCount <= maxBowlers
      && fields.name.length > 0;
  }

  const inputChanged = (element) => {
    const newFormValues = {...componentState };
    switch (element.target.name) {
      case 'bowlerCount':
        newFormValues.fields.bowlerCount = parseInt(element.target.value);
        break;
      case 'name':
        newFormValues.fields[element.target.name] = element.target.value;
        break;
      default:
        return;
    }
    newFormValues.valid = isFormValid(newFormValues.fields);
    setComponentState(newFormValues);
  }

  const shiftIdentifiersUpdated = (newShiftIdentifiers) => {
    const newFormValues = {...componentState };
    newFormValues.fields.shiftIdentifiers = newShiftIdentifiers;
    setComponentState(newFormValues);
  }

  const bowlerCountRadios = [];
  for (let i = 0; i < maxBowlers; i++) {
    const selected = componentState.fields.bowlerCount === i+1;
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

  const tournamentType = tournament.config_items.find(({key}) => key === 'tournament_type').value || 'igbo_standard';

  return (
    <ErrorBoundary>
      <div className={`${classes.TeamForm}`}>
        <p className={`text-center`}>
          All fields are required.
        </p>
        {/* bowler count selector */}
        <div className={`${classes.FormElement}`}>
          <label className={`${classes.Label} col-form-label-lg`}>
            How many bowlers do you have, in total? (Your teammates may add their details later.)
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
                 value={componentState.fields.name}
                 onChange={inputChanged}
                 aria-label={'Team Name'}
                 className={`form-control form-control-lg`}
                 placeholder={'... name ...'}
          />
        </div>

        {/* No shift form for single-shift standard tournaments */}

        {tournamentType === 'igbo_multi_shift' && (
          <InclusiveShiftForm shifts={tournament.shifts}
                              onUpdate={shiftIdentifiersUpdated}/>
        )}

        {tournamentType === 'igbo_mix_and_match' && (
          <MixAndMatchShiftForm shiftsByEvent={tournament.shifts_by_event}
                                onUpdate={shiftIdentifiersUpdated}/>
        )}

        <div className={`${classes.Submit}`}>
          <button className={`btn btn-lg btn-success`}
                  onClick={formHandler}
                  disabled={!componentState.valid}
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
