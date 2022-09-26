import {useState} from "react";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {timezones} from "../../../../utils";

import classes from '../TournamentBuilder.module.scss';

const Scoring = () => {
  const {directorState, dispatch} = useDirectorContext();

  const initialState = {
    fields: {
      percentage: 90,
      average: 225,
      divisions: [],
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [useScratchDivisions, setUseScratchDivisions] = useState(false);
  const [nextDivisionKey, setNextDivisionKey] = useState('A');
  const [permitAddingDivision, setPermitAddingDivision] = useState(true);

  const isValid = (fields) => {
    // TODO
    return true;
  }

  const inputChanged = (event) => {
    const changedData = {...formData};
    const newValue = event.target.value;
    const fieldName = event.target.name;
    changedData.fields[fieldName] = newValue;
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const addDivision = (key) => {
    const data = {...formData};
    data.fields.divisions = formData.fields.divisions.concat({
      key: key,
      name: '',
      lowAverage: '',
      highAverage: '',
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
      <h2>New Tournament: Scoring</h2>

      <div className={`row ${classes.FieldRow} g-2`}>
        <label htmlFor={'percentage'}
               className={'col-12 col-md-5 col-form-label'}>
          Handicap Calculation
        </label>
        <div className={'col-5 col-md-3'}>
          <div className={'input-group'}>
            <input type={'number'}
                   min={0}
                   max={100}
                   name={'percentage'}
                   id={'percentage'}
                   className={'form-control'}
                   value={formData.fields.percentage}
                   onChange={inputChanged}/>
            <span className={'input-group-text'}>
              <i className={'bi-percent'} aria-hidden={true}/>
            </span>
          </div>
        </div>

        <div className={'col-2 col-md-1'}>
          <input type={'text'}
                 readOnly={true}
                 className={'form-control-plaintext text-center'}
                 value={'of'}/>
        </div>

        <div className={'col-5 col-md-3'}>
          <input type={'number'}
                 min={0}
                 max={100}
                 name={'average'}
                 id={'average'}
                 className={'form-control'}
                 value={formData.fields.average}
                 onChange={inputChanged}/>
        </div>
      </div>

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
                         name={`divisions[${i}]key`}
                         id={`divisions_${i}_key`}
                         className={'form-control'}
                         value={divisionFormData.key}
                         onChange={inputChanged}/>
                </div>

                <label htmlFor={`divisions_${i}_low_average`}
                       className={'col-4 col-md-3 col-form-label'}>
                  Low Average
                </label>
                <div className={'col-8 col-md-2'}>
                  <input type={'number'}
                         min={0}
                         max={300}
                         name={`divisions[${i}]low_average`}
                         id={`divisions_${i}_low_average`}
                         className={'form-control'}
                         value={divisionFormData.low_average}
                         onChange={inputChanged}/>
                </div>

                <label htmlFor={`divisions_${i}_high_average`}
                       className={'col-4 col-md-3 col-form-label'}>
                  High Average
                </label>
                <div className={'col-8 col-md-2'}>
                  <input type={'number'}
                         min={0}
                         max={300}
                         name={`divisions[${i}]high_average`}
                         id={`divisions_${i}_high_average`}
                         className={'form-control'}
                         value={divisionFormData.high_average}
                         onChange={inputChanged}/>
                </div>
              </div>

              <div className={`row ${classes.FieldRow} g-1`}>
                <label htmlFor={`divisions_${i}_name`}
                       className={'col-4 col-md-2 col-form-label'}>
                  Name
                </label>
                <div className={'col'}>
                  <input type={'text'}
                         name={`divisions[${i}]name`}
                         id={`divisions_${i}_name`}
                         className={'form-control'}
                         value={divisionFormData.name}
                         placeholder={`e.g., ${divisionNamePlaceholders[divisionFormData.key]}`}
                         onChange={inputChanged}/>
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
        <div className={'col-12 d-flex justify-content-between'}>
          <button className={'btn btn-outline-secondary'}
                  role={'button'}
                  onClick={() => {
                  }}>
            <i className={'bi-arrow-left pe-2'} aria-hidden={true}/>
            Previous
          </button>
          <button className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={() => {
                  }}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Scoring;