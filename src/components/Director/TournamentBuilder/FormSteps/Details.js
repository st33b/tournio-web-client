import {useEffect, useState} from "react";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {devConsoleLog, timezones} from "../../../../utils";

import classes from '../TournamentBuilder.module.scss';
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";
import {directorApiRequest} from "../../../../director";
import {useLoginContext} from "../../../../store/LoginContext";

const Details = () => {
  const {state, dispatch} = useDirectorContext();
  const {authToken} = useLoginContext();

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
    if (!state || !state.builder) {
      return;
    }
    if (state.builder.tournament) {
      // We might have returned to this page after advancing.
      const newFormData = {...formData};
      newFormData.fields.location = state.builder.tournament.location || '';
      newFormData.fields.timezone = state.builder.tournament.timezone || '';
      newFormData.fields.website = state.builder.tournament.website || '';
      const websiteConfigItem = state.builder.tournament.config_items.find(({key}) => key === 'website');
      if (websiteConfigItem) {
        newFormData.fields.website_config_item_id = websiteConfigItem.id
      }

      newFormData.valid = isValid(newFormData.fields);
      setFormData(newFormData);
    }
  }, [state, state.builder])

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

  if (!state.builder) {
    return '';
  }

  const saveSuccess = (data) => {
    // put the updated tournament into context, and set the next step
    dispatch(newTournamentSaved(data));
    dispatch(newTournamentStepCompleted('details', 'dates'));
  }

  const nextClicked = () => {
    const identifier = state.builder.tournament.identifier;
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
      authToken: authToken,
      onSuccess: saveSuccess,
      onFailure: (err) => devConsoleLog("Failed to update tournament.", err),
    });
  }

  return (
    <div>
      <h3>
        {state.builder.tournament.name}{' '}
        ({state.builder.tournament.abbreviation}){' '}
        {state.builder.tournament.year}
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

export default Details;
