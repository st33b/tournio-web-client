import React, {useEffect, useState} from "react";

import classes from './TeamForm.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import InclusiveShiftForm from "../InclusiveShiftForm/InclusiveShiftForm";
import MixAndMatchShiftForm from "../MixAndMatchShiftForm/MixAndMatchShiftForm";
import {devConsoleLog} from "../../../utils";

const TeamForm = ({tournament, team, onSubmit}) => {
  devConsoleLog("------------ component untouched in team restoration");
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
    const tournamentType = tournament.config['tournament_type'] || 'igbo_standard';
    const newComponentState = {...componentState };

    if (team) {
      // we're editing the team, so let's populate the form with what we've been passed as a prop
      newComponentState.fields.name = team.name;
      newComponentState.fields.shiftIdentifiers = [...team.shiftIdentifiers];
      newComponentState.valid = true;
    } else if (tournamentType === 'igbo_standard') {
      newComponentState.fields.shiftIdentifiers = [tournament.shifts[0].identifier];
    }

    setComponentState(newComponentState);
  }, [tournament, team]);

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

  const tournamentType = tournament.config['tournament_type'];
  const useInclusiveShifts = tournamentType === 'igbo_multi_shift' || tournament.config['tournament_type'] === 'single_event' && tournament.shifts.length > 1;
  const useMixAndMatchShifts = tournamentType === 'igbo_mix_and_match';

  return (
    <ErrorBoundary>
      <div className={`${classes.TeamForm}`}>
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
          />
        </div>

        {/* No shift form for single-shift tournaments */}

        {useInclusiveShifts && (
          <InclusiveShiftForm shifts={tournament.shifts}
                              value={team ? team.shiftIdentifiers[0] : null}
                              onUpdate={shiftIdentifiersUpdated}/>
        )}

        {useMixAndMatchShifts && (
          <MixAndMatchShiftForm shifts={tournament.shifts}

                                onUpdate={shiftIdentifiersUpdated}/>
        )}

        <div className={`${classes.Submit}`}>
          <button className={`btn btn-lg btn-primary`}
                  onClick={formHandler}
                  disabled={!componentState.valid}
                  role={'button'}>
            {team ? 'Save' : 'Next: Bowlers'}
            <i className={'bi bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </ErrorBoundary>
  )
};

export default TeamForm;
