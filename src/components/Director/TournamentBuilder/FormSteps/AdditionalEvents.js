import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {devConsoleLog} from "../../../../utils";
import {newTournamentCompleted, newTournamentStepCompleted} from "../../../../store/actions/directorActions";
import {directorApiRequest} from "../../../../director";

import classes from '../TournamentBuilder.module.scss';

const AdditionalEvents = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const DEFAULT_EVENT_DETAILS = {
    roster_type: '',
    name: '',
    scratch: false,
    use_scratch_divisions: false,
    entry_fee: 0,
    scratch_division_entry_fees: [],
  };

  const initialState = {
    fields: {
      events: [
        // {...DEFAULT_EVENT_DETAILS},
      ],
    },
    valid: false,
  }

  const rosterTypeOptions = {
    single: 'Singles',
    double: 'Doubles',
    trio: 'Trios',
    team: 'Team',
  }
  const rosterTypes = Object.keys(rosterTypeOptions);

  const [formData, setFormData] = useState(initialState);
  const [scratchDivisions, setScratchDivisions] = useState([]);
  useEffect(() => {
    if (!directorState || !directorState.builder) {
      return;
    }
    if (directorState.builder.tournament.scratch_divisions) {
      devConsoleLog("Found scratch divisions in context");
      setScratchDivisions(directorState.builder.tournament.scratch_divisions);
    }
  }, [directorState.builder.tournament]);

  const isValid = (fields) => {
    return fields.events.every(({roster_type, name, entry_fee}) => !!rosterTypeOptions[roster_type] && name.length > 0 && entry_fee >= 0)
  }

  const inputChanged = (event) => {
    // name is events.i.FIELDNAME
    const parts = event.target.name.split('.');
    const index = parseInt(parts[1]);
    let fieldName = parts[2];

    const changedData = {...formData};
    let newValue = event.target.value;

    if (event.target.type === 'radio') {
      newValue = newValue === 'true';
    } else if (event.target.type === 'checkbox') {
      newValue = event.target.checked;
    }

    if (fieldName === 'scratch_division_entry_fees') {
      // `events.${i}.scratch_division_entry_fees.${divisionIndex}.fee`
      const divisionIndex = parseInt(parts[3]);
      changedData.fields.events[index].scratch_division_entry_fees[divisionIndex].fee = parseInt(newValue);
    } else {
      changedData.fields.events[index][fieldName] = newValue;
      if (fieldName === 'use_scratch_divisions' && newValue) {
        if (scratchDivisions || scratchDivisions.length > 0) {
          changedData.fields.events[index].scratch_division_entry_fees = getDivisionEntryFees(changedData.fields.events[index]);
        }
      }
    }

    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const getDivisionEntryFees = (event) => {
    if (event.scratch_division_entry_fees.length > 0) {
      return [...event.scratch_division_entry_fees];
    }
    return scratchDivisions.map(({id, key}) => (
      {
        id: id,
        fee: '',
      }
    ));
  }

  const addEventClicked = () => {
    const data = {...formData};
    data.fields.events = formData.fields.events.concat(
      {...DEFAULT_EVENT_DETAILS},
    );
    setFormData(data);
  }

  const removeEventClicked = () => {
    const data = {...formData};
    data.fields.events = formData.fields.events.slice(0, -1);
    setFormData(data);
  }

  const onSaveSuccess = () => {
    const identifier = directorState.builder.tournament.identifier;
    dispatch(newTournamentCompleted());
    router.push(`/director/tournaments/${identifier}`);
  }

  const finishClicked = () => {
    if (formData.fields.events.length === 0 ) {
      onSaveSuccess();
    } else {
      const identifier = directorState.builder.tournament.identifier;
      const uri = `/director/tournaments/${identifier}`;
      const requestData = {
        tournament: {
          events_attributes: dataForUpdate(formData.fields.events),
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
        onFailure: (err) => devConsoleLog("Failed to save additional events.", err),
      });
    }
  }

  const dataForUpdate = (eventFormData) => {
    return eventFormData.map(e => {
      const eventData = (({roster_type, name, scratch}) => ({ roster_type, name, scratch}))(e);
      if (e.use_scratch_divisions) {
        eventData.scratch_division_entry_fees = e.scratch_division_entry_fees;
      } else {
        eventData.entry_fee = e.entry_fee;
      }
      eventData.required = false;
      return eventData;
    });
  }

  return (
    <div>
      <h2>{directorState.builder.tournament.name}: Additional Events</h2>

      <p>
        Optional, bowled tournament events, such as Scratch Masters or a 9-pin no-tap mixer. These are in addition to any required events.
      </p>

      <fieldset>
        {formData.fields.events.map(({roster_type, name}, i) => (
          <div key={i} className={classes.Event}>
            <div className={`row ${classes.FieldRow}`}>
              <label htmlFor={`events_${i}_name`}
                     className={'col-12 col-md-3 col-form-label'}>
                Event Name
              </label>
              <div className={'col'}>
                <input type={'text'}
                       name={`events.${i}.name`}
                       id={`events_${i}_name`}
                       className={'form-control'}
                       value={formData.fields.events[i].name}
                       onChange={inputChanged}/>
              </div>
            </div>

            <div className={`row ${classes.FieldRow}`}>
              <label htmlFor={`events_${i}_roster_type`}
                     className={'col-12 col-md-3 col-form-label'}>
                Roster Type
              </label>
              <div className={'col col-md-4'}>
                <select name={`events.${i}.roster_type`}
                        id={`events_${i}_roster_type`}
                        className={'form-select'}
                        value={formData.fields.events[i].roster_type}
                        onChange={inputChanged}>
                  <option value={''}>-- select one --</option>
                  {rosterTypes.map(value => <option key={value} value={value}>{rosterTypeOptions[value]}</option>)}
                </select>
              </div>
            </div>

            <div className={`row ${classes.FieldRow}`}>
              <label className={'col-12 col-md-3 col-form-label'}>
                Scoring
              </label>
              <div className={'col'}>
                <div className={'form-check'}>
                  <input className={'form-check-input'}
                         type={'radio'}
                         name={`events.${i}.scratch`}
                         id={`events_${i}_scratch`}
                         value={'true'}
                         onChange={inputChanged}/>
                  <label className={'form-check-label'}
                         htmlFor={`events_${i}_scratch`}>
                    Scratch
                  </label>
                </div>

                <div className={'form-check'}>
                  <input className={'form-check-input'}
                         type={'radio'}
                         name={`events.${i}.scratch`}
                         id={`events_${i}_handicap`}
                         value={'false'}
                         onChange={inputChanged}/>
                  <label className={'form-check-label'}
                         htmlFor={`events_${i}_handicap`}>
                    Handicap
                  </label>
                </div>
              </div>
            </div>

            {formData.fields.events[i].scratch && scratchDivisions.length > 0 && (
              <div className={`row ${classes.FieldRow}`}>
                <div className={'col-12 col-md-9 offset-md-3'}>
                  <div className={'form-check'}>
                    <input type={'checkbox'}
                           id={`events_${i}_use_scratch_divisions`}
                           name={`events.${i}.use_scratch_divisions`}
                           className={'form-check-input'}
                           checked={formData.fields.events[i].use_scratch_divisions}
                           onChange={inputChanged}/>
                    <label className={'form-check-label'}
                           htmlFor={`events_${i}_use_scratch_divisions`}>
                      Use scratch divisions
                    </label>
                  </div>
                </div>
              </div>
            )}

            {(!formData.fields.events[i].scratch || !formData.fields.events[i].use_scratch_divisions) && (
              <div className={`row ${classes.FieldRow}`}>
                <label className={'col-12 col-md-3 col-form-label'}>
                  Entry Fee
                </label>
                <div className={'col col-md-3'}>
                  <div className={'input-group'}>
                    <span className={'input-group-text'}>
                      <i className={'bi-currency-dollar'} aria-hidden={true}/>
                    </span>
                    <input type={'number'}
                           name={`events.${i}.entry_fee`}
                           id={`events_${i}_entry_fee`}
                           className={'form-control'}
                           value={formData.fields.events[i].entry_fee}
                           onChange={inputChanged}/>
                  </div>
                </div>
              </div>
            )}

            {formData.fields.events[i].scratch && formData.fields.events[i].use_scratch_divisions && (
              <div className={`row ${classes.FieldRow}`}>
                <label className={'col-12 col-md-3 col-form-label'}>
                  Entry Fees per Division
                </label>
                <div className={'col'}>
                  {formData.fields.events[i].scratch_division_entry_fees.map((division, j) => (
                      <div className={'row mb-2'} key={j}>
                        <label className={'col-3 col-form-label'}>
                          Division
                        </label>
                        <div className={'col-2'}>
                          <input type={'text'}
                                 readOnly={true}
                                 className={'form-control-plaintext'}
                                 value={division.key}
                                 />
                        </div>
                        <label htmlFor={`events_${i}_scratch_division_entry_fees_${j}_fee`}
                               className={'col-2 col-form-label'}>
                          Fee
                        </label>
                        <div className={'col-5'}>
                          <div className={'input-group'}>
                          <span className={'input-group-text'}>
                            <i className={'bi-currency-dollar'} aria-hidden={true}/>
                          </span>
                            <input type={'number'}
                                   min={0}
                                   name={`events.${i}.scratch_division_entry_fees.${j}.fee`}
                                   id={`events_${i}_scratch_division_entry_fees_${j}_fee`}
                                   className={'form-control'}
                                   value={division.fee}
                                   onChange={inputChanged}/>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

            )}

            {i === formData.fields.events.length - 1 && (
              <div className={`row ${classes.FieldRow}`}>
                <div className={'col d-flex justify-content-end'}>
                  <button type={'button'}
                          className={'btn btn-sm btn-outline-danger'}
                          onClick={removeEventClicked}>
                    <i className={'bi-dash-lg pe-2'} aria-hidden={true}/>
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {formData.fields.events.length < Object.keys(rosterTypeOptions).length && (
          <div className={`row ${classes.FieldRow}`}>
            <div className={'col text-center'}>
              <button type={'button'}
                      className={'btn btn-sm btn-outline-secondary'}
                      name={'addEvent'}
                      onClick={addEventClicked}>
                <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
                Add Event
              </button>
            </div>
          </div>
        )}
      </fieldset>

      <div className={`row ${classes.ButtonRow}`}>
        <div className={'col-12 d-flex justify-content-end'}>
          <button className={'btn btn-primary'}
                  role={'button'}
                  onClick={finishClicked}>
            Finish
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdditionalEvents;