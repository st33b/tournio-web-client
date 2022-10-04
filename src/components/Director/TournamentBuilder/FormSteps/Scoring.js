import {useEffect, useState} from "react";
import {useDirectorContext} from "../../../../store/DirectorContext";

import classes from '../TournamentBuilder.module.scss';
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";
import {directorApiRequest} from "../../../../director";
import {devConsoleLog} from "../../../../utils";

const Scoring = () => {
  const context = useDirectorContext();
  const directorState = context.directorState;
  const dispatch = context.dispatch;

  const initialState = {
    fields: {
      // we aren't using the handicap rule yet
      // useHandicapRule: false,
      // percentage: 90,
      // average: 225,
      divisions: [],
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [useScratchDivisions, setUseScratchDivisions] = useState(false);
  const [nextDivisionKey, setNextDivisionKey] = useState('A');
  const [permitAddingDivision, setPermitAddingDivision] = useState(true);

  useEffect(() => {
    if (!directorState || !directorState.builder) {
      return;
    }
    if (directorState.builder.tournament.scratch_divisions.length > 0) {
      // We've returned to this page after advancing.
      const newFormData = {...formData};

      // skip handicap rule for now, since we aren't using that just yet...

      newFormData.fields.divisions = [...directorState.builder.tournament.scratch_divisions];

      newFormData.valid = isValid(newFormData.fields);
      setFormData(newFormData);
      setUseScratchDivisions(true);
    }
  }, [directorState, directorState.builder])

  if (!directorState || !directorState.builder) {
    return '';
  }

  const isValid = (fields) => {
    const divisionsValid = formData.fields.divisions.every(({key, low_average, high_average}) => {
      return key.length > 0 && low_average >= 0 && low_average < 300 && high_average > 0 && high_average <= 300 && low_average <= high_average;
    });
    return divisionsValid;
    // const handicapRuleIsValid = !formData.fields.useHandicapRule ||
    //   formData.fields.percentage >= 0 && formData.fields.percentage <= 100 && formData.fields.average > 0 && formData.fields.average <= 300;
    // return divisionsValid && handicapRuleIsValid;
  }

  const inputChanged = (event) => {
    const changedData = {...formData};
    const fieldName = event.target.name;
    changedData.fields[fieldName] = parseInt(event.target.value);
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const divisionInputChanged = (event, index) => {
    const changedData = {...formData};
    const fieldName = event.target.name;
    const newValue = event.target.value.length > 0 && (fieldName === 'low_average' || fieldName === 'high_average') ? parseInt(event.target.value) : event.target.value;
    changedData.fields.divisions[index][fieldName] = newValue;
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const addDivision = (key) => {
    const data = {...formData};
    data.fields.divisions = formData.fields.divisions.concat({
      key: key,
      name: '',
      low_average: '',
      high_average: '',
    });
    setFormData(data);
  }

  const removeLastDivision = () => {
    const data = {...formData};
    const lastDivision = formData.fields.divisions[formData.fields.divisions.length - 1]
    data.fields.divisions = formData.fields.divisions.slice(0, -1);
    setFormData(data);
    setNextDivisionKey(lastDivision.key);
  }

  const enableDivisions = () => {
    let key = nextDivisionKey;
    for (let i = 0; i < 4; i++) {
      addDivision(key);
      key = String.fromCharCode(key.charCodeAt(0) + 1);
    }
    setNextDivisionKey(key);
    setUseScratchDivisions(true);
  }

  const addDivisionClicked = () => {
    addDivision(nextDivisionKey);
    const nextKey = String.fromCharCode(nextDivisionKey.charCodeAt(0) + 1);
    setNextDivisionKey(nextKey);
    if (nextKey === 'H') {
      setPermitAddingDivision(false);
    }
  }

  const removeDivisionClicked = () => {
    removeLastDivision();
    setPermitAddingDivision(true);
  }

  const onSaveSuccess = (data) => {
    dispatch(newTournamentSaved(data));
    dispatch(newTournamentStepCompleted('scoring', 'additional_events'));
  }

  const nextClicked = () => {
    if (formData.fields.divisions.length === 0 ) {
      dispatch(newTournamentStepCompleted('scoring', 'additional_events'));
    } else {
      const identifier = directorState.builder.tournament.identifier;
      const uri = `/director/tournaments/${identifier}`;
      const requestData = {
        tournament: {
          scratch_divisions_attributes: formData.fields.divisions,
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
        onFailure: (err) => devConsoleLog("Failed to update tournament.", err),
      });
    }
  }

  const divisionNamePlaceholders = {
    A: 'ABBA',
    B: 'Beyonce',
    C: 'Carly Rae Jepsen',
    D: 'Diana Ross',
    E: 'En Vogue',
    F: 'Fifth Harmony',
    G: 'Gloria Estefan',
  }

  return (
    <div>
      <h2>{directorState.builder.tournament.name}: Scoring</h2>

      {/* We don't need this yet */}
      {/*<div className={`row ${classes.FieldRow} g-2`}>*/}
      {/*  <label htmlFor={'percentage'}*/}
      {/*         className={'col-12 col-md-5 col-form-label'}>*/}
      {/*    Handicap Calculation*/}
      {/*  </label>*/}
      {/*  <div className={'col-5 col-md-3'}>*/}
      {/*    <div className={'input-group'}>*/}
      {/*      <input type={'number'}*/}
      {/*             min={0}*/}
      {/*             max={100}*/}
      {/*             name={'percentage'}*/}
      {/*             id={'percentage'}*/}
      {/*             className={'form-control'}*/}
      {/*             value={formData.fields.percentage}*/}
      {/*             onChange={inputChanged}/>*/}
      {/*      <span className={'input-group-text'}>*/}
      {/*        <i className={'bi-percent'} aria-hidden={true}/>*/}
      {/*      </span>*/}
      {/*    </div>*/}
      {/*  </div>*/}

      {/*  <div className={'col-2 col-md-1'}>*/}
      {/*    <input type={'text'}*/}
      {/*           readOnly={true}*/}
      {/*           className={'form-control-plaintext text-center'}*/}
      {/*           value={'of'}/>*/}
      {/*  </div>*/}

      {/*  <div className={'col-5 col-md-3'}>*/}
      {/*    <input type={'number'}*/}
      {/*           min={0}*/}
      {/*           max={300}*/}
      {/*           name={'average'}*/}
      {/*           id={'average'}*/}
      {/*           className={'form-control'}*/}
      {/*           value={formData.fields.average}*/}
      {/*           onChange={inputChanged}/>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {!useScratchDivisions && (
        <div className={`row ${classes.FieldRow}`}>
          <div className={'col'}>
            <button type={'button'}
                    className={'btn btn-primary'}
                    name={'enableScratchDivisions'}
                    onClick={enableDivisions}>
              Use Scratch Divisions
            </button>
          </div>
        </div>
      )}

      {useScratchDivisions && (
        <fieldset>
          <legend>
            Scratch Divisions (max of 7)
          </legend>

          {formData.fields.divisions.map((divisionFormData, i) => (
            <div key={i} className={classes.ScratchDivision}>
              <div className={`row ${classes.FieldRow} g-1`}>
                <label htmlFor={`divisions_${i}_key`}
                       className={'col-4 col-md-1 col-form-label'}>
                  Key
                </label>
                <div className={'col-8 col-md-1'}>
                  <input type={'text'}
                         name={'key'}
                         id={`divisions_${i}_key`}
                         className={'form-control'}
                         value={divisionFormData.key}
                         onChange={(e) => divisionInputChanged(e, i)}/>
                </div>

                <label htmlFor={`divisions_${i}_low_average`}
                       className={'col-4 col-md-3 col-form-label'}>
                  Low Average
                </label>
                <div className={'col-8 col-md-2'}>
                  <input type={'number'}
                         min={0}
                         max={300}
                         name={'low_average'}
                         id={`divisions_${i}_low_average`}
                         className={'form-control'}
                         value={divisionFormData.low_average}
                         onChange={(e) => divisionInputChanged(e, i)}/>
                </div>

                <label htmlFor={`divisions_${i}_high_average`}
                       className={'col-4 col-md-3 col-form-label'}>
                  High Average
                </label>
                <div className={'col-8 col-md-2'}>
                  <input type={'number'}
                         min={0}
                         max={300}
                         name={'high_average'}
                         id={`divisions_${i}_high_average`}
                         className={'form-control'}
                         value={divisionFormData.high_average}
                         onChange={(e) => divisionInputChanged(e, i)}/>
                </div>
              </div>

              <div className={`row ${classes.FieldRow} g-1`}>
                <label htmlFor={`divisions_${i}_name`}
                       className={'col-4 col-md-2 col-form-label'}>
                  Name
                </label>
                <div className={'col'}>
                  <input type={'text'}
                         name={'name'}
                         id={`divisions_${i}_name`}
                         className={'form-control'}
                         value={divisionFormData.name}
                         placeholder={`e.g., ${divisionNamePlaceholders[divisionFormData.key]}`}
                         onChange={(e) => divisionInputChanged(e, i)}/>
                  <div className={'form-text'}>
                    Optional
                  </div>
                </div>
              </div>
              {i == formData.fields.divisions.length - 1 && (
                <div className={`row ${classes.FieldRow}`}>
                  <div className={'col d-flex justify-content-end'}>
                    <button type={'button'}
                            className={'btn btn-sm btn-outline-danger'}
                            onClick={removeDivisionClicked}>
                      <i className={'bi-dash-lg pe-2'} aria-hidden={true}/>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {permitAddingDivision && (
            <div className={`row ${classes.FieldRow}`}>
              <div className={'col text-center'}>
                <button type={'button'}
                        className={'btn btn-sm btn-outline-secondary'}
                        name={'addDivision'}
                        onClick={addDivisionClicked}>
                  <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
                  Add Division
                </button>
              </div>
            </div>
          )}

        </fieldset>
      )} {/* useScratchDivisions */}


      <div className={`row ${classes.ButtonRow}`}>
        <div className={'col-12 d-flex justify-content-end'}>
          <button className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={nextClicked}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Scoring;