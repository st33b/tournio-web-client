import {useEffect, useState} from "react";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {devConsoleLog, timezones} from "../../../../utils";

import classes from '../TournamentBuilder.module.scss';
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";
import {directorApiRequest} from "../../../../director";

const Details = () => {
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const initialState = {
    fields: {
      location: '',
      timezone: '',
      website: '',
      website_config_item_id: null,
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  useEffect(() => {
    if (!directorState || !directorState.builder) {
      return;
    }
    if (directorState.builder.tournament) {
      // We've returned to this page after advancing.
      const newFormData = {...formData};
      newFormData.fields.location = directorState.builder.tournament.location;
      newFormData.fields.timezone = directorState.builder.tournament.timezone;
      newFormData.fields.website = directorState.builder.tournament.website;
      newFormData.fields.website_config_item_id = directorState.builder.tournament.config_items.find(({key}) => key === 'website').id
      newFormData.valid = isValid(newFormData.fields);
      setFormData(newFormData);
    }
  }, [directorState, directorState.builder])

  const isValid = (fields) => {
    return fields.location.length > 0 && fields.timezone.length > 0;
  }

  const inputChanged = (event) => {
    const changedData = {...formData};
    const newValue = event.target.value;
    const fieldName = event.target.name;
    changedData.fields[fieldName] = newValue;
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  if (!directorState.builder) {
    return '';
  }

  const saveSuccess = (data) => {
    // put the updated tournament into context, and set the next step
    dispatch(newTournamentSaved(data));
    dispatch(newTournamentStepCompleted('details', 'dates'));
  }

  const nextClicked = () => {
    const identifier = directorState.builder.tournament.identifier;
    const uri = `/director/tournaments/${identifier}`;
    const configItemAttributes = {
      key: 'website',
      value: formData.fields.website,
    }
    if (formData.fields.website_config_item_id) {
      configItemAttributes.id = formData.fields.website_config_item_id;
    }
    const requestConfig = {
      method: 'patch',
      data: {
        tournament: {
          location: formData.fields.location,
          timezone: formData.fields.timezone,
          config_items_attributes: [
            configItemAttributes,
          ],
        },
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: saveSuccess,
      onFailure: (err) => devConsoleLog("Failed to update tournament.", err),
    });
  }

  return (
    <div>
      <h3>
        {directorState.builder.tournament.name}{' '}
        ({directorState.builder.tournament.abbreviation}){' '}
        {directorState.builder.tournament.year}
      </h3>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'location'}
               className={'col-12 col-md-3 col-form-label'}>
          City, State
        </label>
        <div className={'col'}>
          <input type={'text'}
                 name={'location'}
                 id={'location'}
                 className={'form-control'}
                 value={formData.fields.location}
                 onChange={inputChanged}/>
        </div>
      </div>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'timezone'}
               className={'col-12 col-md-3 col-form-label'}>
          Time Zone
        </label>
        <div className={'col'}>
          <select name={'timezone'}
                  className={'form-select'}
                  onChange={inputChanged}
                  value={formData.fields.timezone}>
            <option value={''}>--</option>
            {Object.values(timezones).map(({key, display}) => (
              <option value={key} key={key}>{display}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'website'}
               className={'col-12 col-md-3 col-form-label'}>
          Website URL
        </label>
        <div className={'col'}>
          <input type={'text'}
                 name={'website'}
                 id={'website'}
                 className={'form-control'}
                 value={formData.fields.website}
                 onChange={inputChanged}/>
        </div>
      </div>

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
                  onClick={nextClicked}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Details;