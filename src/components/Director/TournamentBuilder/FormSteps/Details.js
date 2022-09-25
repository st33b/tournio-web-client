import {useState} from "react";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {timezones} from "../../../../utils";

import classes from '../TournamentBuilder.module.scss';

const Name = () => {
  const {directorState, dispatch} = useDirectorContext();

  const initialState = {
    fields: {
      location: '',
      timezone: '',
      website: '',
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);

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

  return (
    <div>
      <h2>New Tournament: Details</h2>

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

      <div className={`row ${classes.FieldRow}`}>
        <div className={'col-12 d-flex justify-content-end'}>
          <button className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={() => {}}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Name;