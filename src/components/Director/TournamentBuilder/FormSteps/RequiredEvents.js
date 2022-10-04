import {useState} from "react";
import {useDirectorContext} from "../../../../store/DirectorContext";

import classes from '../TournamentBuilder.module.scss';
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";
import {directorApiRequest} from "../../../../director";
import {devConsoleLog} from "../../../../utils";

const RequiredEvents = () => {
  const context = useDirectorContext();
  const directorState = context.directorState;
  const dispatch = context.dispatch;

  const DEFAULT_EVENT_DETAILS = {
    roster_type: '',
    name: '',
    // game_count: 3,
  };

  // Default to 3 games until we add support for customizing the number of games in a required event.
  const initialState = {
    fields: {
      events: [
        {...DEFAULT_EVENT_DETAILS},
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

  const isValid = (fields) => {
    return fields.events.every(({roster_type, name}) => !!rosterTypeOptions[roster_type] && name.length > 0)
  }

  const inputChanged = (event, index) => {
    const changedData = {...formData};
    const newValue = event.target.value;
    const fieldName = event.target.name;
    changedData.fields.events[index][fieldName] = newValue;
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const rosterTypeBlurred = (index) => {
    const data = {...formData};

    const rosterType = data.fields.events[index].roster_type;
    data.fields.events[index].name = rosterTypeOptions[rosterType];
    setFormData(data);
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

  const onSaveSuccess = (data) => {
    dispatch(newTournamentSaved(data));
    dispatch(newTournamentStepCompleted('required_events', 'additional_events'));
  }

  const nextClicked = () => {
    if (formData.fields.events.length === 0 ) {
      dispatch(newTournamentStepCompleted('required_events', 'additional_events'));
    } else {
      const identifier = directorState.builder.tournament.identifier;
      const uri = `/director/tournaments/${identifier}`;
      const requestData = {
        tournament: {
          events_attributes: formData.fields.events,
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

  return (
    <div>
      <h2>{directorState.builder.tournament.name}: Required Events</h2>

      <p>
        Events that all participants in the tournament will bowl.
      </p>

      <fieldset>
        {formData.fields.events.map(({roster_type, name}, i) => (
          <div key={i} className={classes.Event}>
            <div className={`row ${classes.FieldRow}`}>
              <label htmlFor={`events_${i}_roster_type`}
                     className={'col-12 col-md-3 col-form-label'}>
                Roster Type
              </label>
              <div className={'col col-md-6'}>
                <select name={'roster_type'}
                        id={`events_${i}_roster_type`}
                        className={'form-select'}
                        value={formData.fields.events[i].roster_type}
                        onChange={(e) => inputChanged(e, i)}
                        onBlur={() => rosterTypeBlurred(i)}>
                  <option value={''}>-- select one --</option>
                  {rosterTypes.map(value => <option key={value} value={value}>{rosterTypeOptions[value]}</option>)}
                </select>
              </div>
            </div>

            <div className={`row ${classes.FieldRow}`}>
              <label htmlFor={`events_${i}_name`}
                     className={'col-12 col-md-3 col-form-label'}>
                Event Name
              </label>
              <div className={'col col-md-6'}>
                <input type={'text'}
                       name={'name'}
                       id={`events_${i}_name`}
                       className={'form-control'}
                       value={formData.fields.events[i].name}
                       onChange={(e) => inputChanged(e, i)}/>
              </div>
            </div>

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

export default RequiredEvents;