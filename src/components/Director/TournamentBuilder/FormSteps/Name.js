import {useEffect, useState} from "react";
import chars from 'voca/chars';
import isUpperCase from 'voca/is_upper_case';
import {useDirectorContext} from "../../../../store/DirectorContext";
import {devConsoleLog} from "../../../../utils";
import {directorApiRequest} from "../../../../director";

import classes from '../TournamentBuilder.module.scss';
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";

const Name = () => {
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const currentYear = (new Date()).getFullYear();

  const initialState = {
    fields: {
      name: '',
      abbreviation: '',
      year: currentYear,
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
      newFormData.fields.name = directorState.builder.tournament.name;
      newFormData.fields.abbreviation = directorState.builder.tournament.abbreviation;
      newFormData.fields.year = directorState.builder.tournament.year;
      newFormData.valid = isValid(newFormData.fields);
      setFormData(newFormData);
    }
  }, [directorState, directorState.builder])

  const yearOptions = [];
  for (let i = 0; i < 3; i++) {
    yearOptions.push(currentYear + i);
  }

  const isValid = (fields) => {
    return fields.name.length > 0 && yearOptions.includes(fields.year);
  }

  const inputChanged = (event) => {
    const changedData = {...formData};
    let newValue = event.target.value;
    const fieldName = event.target.name;
    if (fieldName === 'year') {
      newValue = parseInt(newValue);
    }
    changedData.fields[fieldName] = newValue;
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const nameBlurred = () => {
    const data = {...formData};

    const letters = chars(data.fields.name);
    const upperChars = letters.filter(l => isUpperCase(l));

    data.fields.abbreviation = upperChars.join('');
    setFormData(data);
  }

  const saveSuccess = (data) => {
    // put the new/updated tournament into context, and set the next step
    dispatch(newTournamentSaved(data));
    dispatch(newTournamentStepCompleted('name', 'details'));
  }

  const nextClicked = () => {
    const alreadyExists = directorState.builder.saved;
    let uri = '/director/tournaments';
    const requestConfig = {
      data: {
        tournament: {
          name: formData.fields.name,
            abbreviation: formData.fields.abbreviation,
            year: formData.fields.year,
        },
      },
    };
    if (alreadyExists) {
      devConsoleLog("Tournament already exists, PATCHing");
      uri += `/${directorState.builder.tournament.identifier}`;
      requestConfig.method = 'patch';
    } else {
      devConsoleLog("Tournament is brand new, POSTing");
      requestConfig.method = 'post';
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: saveSuccess,
      onFailure: (err) => devConsoleLog("Failed to save tournament.", err),
    });
  }

  return (
    <div>
      <h2>New Tournament: Basics</h2>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'name'}
               className={'col-12 col-md-3 col-form-label'}>
          Name
        </label>
        <div className={'col-12 col-md-9'}>
          <input type={'text'}
                 name={'name'}
                 id={'name'}
                 className={'form-control'}
                 value={formData.fields.name}
                 onBlur={nameBlurred}
                 onChange={inputChanged}/>
        </div>
      </div>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'abbreviation'}
               className={'col-12 col-md-3 col-form-label'}>
          Abbreviation
        </label>
        <div className={'col-5'}>
          <input type={'text'}
                 name={'abbreviation'}
                 id={'abbreviation'}
                 className={'form-control'}
                 value={formData.fields.abbreviation}
                 onChange={inputChanged}/>
        </div>
      </div>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'year'}
               className={'col-12 col-md-3 col-form-label'}>
          Year
        </label>
        <div className={'col-5'}>
          <select name={'year'}
                  id={'year'}
                  className={'form-select'}
                  value={formData.fields.year}
                  onChange={inputChanged}>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

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

export default Name;
