import React, {useEffect, useState} from "react";

import classes from './TeamForm.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import InclusiveShiftForm from "../InclusiveShiftForm/InclusiveShiftForm";
import MixAndMatchShiftForm from "../MixAndMatchShiftForm/MixAndMatchShiftForm";
import {devConsoleLog} from "../../../utils";

const TeamForm = ({tournament, onSubmit}) => {
  const initialFormValues = {
    fields: {
      name: '',
      shiftIdentifiers: [],
    },
    valid: false,
  }
  const [componentState, setComponentState] = useState(initialFormValues);

  useEffect(() => {
    if (!tournament) {
      return;
    }
    const tournamentType = tournament.config_items.find(({key}) => key === 'tournament_type').value || 'igbo_standard';
    if (tournamentType === 'igbo_standard') {
      const newComponentState = {...componentState };
      newComponentState.fields.shiftIdentifiers = [tournament.shifts[0].identifier];
      setComponentState(newComponentState);
    }
  }, [tournament]);

  const formHandler = (event) => {
    event.preventDefault();

    if (!componentState.valid) {
      return;
    }

    onSubmit(componentState.fields);
  }

  const isFormValid = (fields) => {
    return fields.name.length > 0;
  }

  const inputChanged = (element) => {
    const newFormValues = {...componentState };
    switch (element.target.name) {
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
    devConsoleLog("Shift identifiers updated:", newShiftIdentifiers);
    const newFormValues = {...componentState };
    newFormValues.fields.shiftIdentifiers = newShiftIdentifiers;
    setComponentState(newFormValues);
  }

  const tournamentType = tournament.config_items.find(({key}) => key === 'tournament_type').value || 'igbo_standard';

  return (
    <ErrorBoundary>
      <div className={`${classes.TeamForm}`}>
        <p className={`text-center`}>
          All fields are required.
        </p>

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
