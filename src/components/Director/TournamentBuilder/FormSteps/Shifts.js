import {useDirectorContext} from "../../../../store/DirectorContext";

import classes from '../TournamentBuilder.module.scss';
import React, {useEffect, useState} from "react";
import {devConsoleLog} from "../../../../utils";
import {directorApiRequest} from "../../../../director";
import {useRouter} from "next/router";
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";

const Shifts = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const DEFAULT_SHIFT_DETAILS = {
    name: '',
    description: '',
    capacity: 0,
    display_order: 1,
  };

  const initialState = {
    fields: {
      shifts: [
        {...DEFAULT_SHIFT_DETAILS},
      ],
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [shifts, setShifts] = useState([]);
  useEffect(() => {
    if (!directorState || !directorState.builder) {
      return;
    }
    if (directorState.builder.tournament.shifts) {
      // We might have returned to this page after advancing.
      devConsoleLog("Found shifts in context");
      setShifts(directorState.builder.tournament.shifts);
      const data = {...formData};
      data.fields.shifts = directorState.builder.tournament.shifts;
      data.valid = isValid(data.fields);
      setFormData(data);
    }
  }, [directorState, directorState.builder]);

  const isValid = (fields) => {
    const namesArePresent = fields.shifts.length < 2 || fields.shifts.every(({name}) => name.length > 0);
    const numbersArePositive = fields.shifts.every(({capacity, display_order}) => capacity > 0 && display_order > 0);
    return namesArePresent && numbersArePositive;
  }

  const inputChanged = (event) => {
    // name is shifts.i.FIELDNAME
    const parts = event.target.name.split('.');
    const index = parseInt(parts[1]);
    let fieldName = parts[2];

    const changedData = {...formData};
    let newValue = event.target.value;

    if (event.target.type === 'number') {
      newValue = parseInt(newValue);
    }
    changedData.fields.shifts[index][fieldName] = newValue;
    changedData.valid = isValid(changedData.fields);

    setFormData(changedData);
  }

  const addShiftClicked = () => {
    const data = {...formData};
    data.fields.shifts = formData.fields.shifts.concat(
      {...DEFAULT_SHIFT_DETAILS},
    );
    data.valid = isValid(data.fields);
    setFormData(data);
  }

  const removeShiftClicked = () => {
    const data = {...formData};
    data.fields.shifts = formData.fields.shifts.slice(0, -1);
    data.valid = isValid(data.fields);
    setFormData(data);
  }

  const onSaveSuccess = (data) => {
    dispatch(newTournamentSaved(data));
    dispatch(newTournamentStepCompleted('shifts', 'scoring'));
  }

  const nextClicked = () => {
    if (formData.fields.shifts.length === 0) {
      dispatch(newTournamentStepCompleted('shifts', 'scoring'));
    } else {
      const identifier = directorState.builder.tournament.identifier;
      const uri = `/director/tournaments/${identifier}`;
      const requestData = {
        tournament: {
          shifts_attributes: formData.fields.shifts,
        },
      }
      const requestConfig = {
        method: 'patch',
        data: requestData,
      };
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        context: context,
        onSuccess: onSaveSuccess,
        onFailure: (err) => devConsoleLog("Failed to save shifts.", err),
      });
    }
  }

  const displayRequiredText = formData.fields.shifts.length > 1;

  return (
    <div>
      <h2>{directorState.builder.tournament.name}: Shifts</h2>

      <fieldset>
        {formData.fields.shifts.map(({name, description, capacity, display_order}, i) => (
            <div key={i} className={classes.Shift}>
              <div className={`row ${classes.FieldRow}`}>
                <label htmlFor={`shifts_${i}_name`}
                       className={'col-12 col-md-3 col-form-label'}>
                  Shift Name
                  {displayRequiredText && (
                    <span className={classes.RequiredLabel}>
                      *
                    </span>
                  )}
                </label>
                <div className={'col-12 col-md-4'}>
                  <input type={'text'}
                         name={`shifts.${i}.name`}
                         id={`shifts_${i}_name`}
                         className={'form-control'}
                         value={formData.fields.shifts[i].name}
                         onChange={inputChanged}/>
                  {displayRequiredText && (
                    <small className="form-text text-muted">
                      * Required for tournaments with multiple shifts
                    </small>)
                  }
                </div>
              </div>

              <div className={`row ${classes.FieldRow}`}>
                <label htmlFor={`shifts_${i}_description`}
                       className={'col-12 col-md-3 col-form-label'}>
                  Description
                </label>
                <div className={'col'}>
                  <input type={'text'}
                         name={`shifts.${i}.description`}
                         id={`shifts_${i}_description`}
                         className={'form-control'}
                         value={formData.fields.shifts[i].description}
                         onChange={inputChanged}/>
                </div>
              </div>

              <div className={`row ${classes.FieldRow}`}>
                <label htmlFor={`shifts_${i}_capacity`}
                       className={'col-12 col-md-3 col-form-label'}>
                  Capacity (bowlers)
                </label>
                <div className={'col-12 col-md-3'}>
                  <input type={'number'}
                         name={`shifts.${i}.capacity`}
                         id={`shifts_${i}_capacity`}
                         className={'form-control'}
                         value={formData.fields.shifts[i].capacity}
                         onChange={inputChanged}/>
                </div>
              </div>

              <div className={`row ${classes.FieldRow}`}>
                <label htmlFor={`shifts_${i}_display_order`}
                       className={'col-12 col-md-3 col-form-label'}>
                  Display Order
                </label>
                <div className={'col-12 col-md-3'}>
                  <input type={'number'}
                         name={`shifts.${i}.display_order`}
                         id={`shifts_${i}_display_order`}
                         className={'form-control'}
                         value={formData.fields.shifts[i].display_order}
                         onChange={inputChanged}/>
                </div>
              </div>

              {i > 0 && i == formData.fields.shifts.length - 1 && (
                <div className={`row ${classes.FieldRow}`}>
                  <div className={'col d-flex justify-content-end'}>
                    <button type={'button'}
                            className={'btn btn-sm btn-outline-danger'}
                            onClick={removeShiftClicked}>
                      <i className={'bi-dash-lg pe-2'} aria-hidden={true}/>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        <div className={`row ${classes.FieldRow}`}>
          <div className={'col text-center'}>
            <button className={'btn btn-sm btn-outline-secondary'}
                    type={'button'}
                    name={'addShift'}
                    onClick={addShiftClicked}>
              <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
              Add Shift
            </button>
          </div>
        </div>
      </fieldset>

      <div className={`row ${classes.ButtonRow}`}>
        <div className={'col-12 d-flex justify-content-end'}>
          <button className={'btn btn-outline-primary'}
                  role={'button'}
                  disabled={!formData.valid}
                  onClick={nextClicked}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>

    </div>
  );
}

export default Shifts
