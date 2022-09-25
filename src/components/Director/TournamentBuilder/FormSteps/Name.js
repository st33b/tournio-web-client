import {useState} from "react";
import chars from 'voca/chars';
import isUpperCase from 'voca/is_upper_case';
import {useDirectorContext} from "../../../../store/DirectorContext";

import classes from '../TournamentBuilder.module.scss';

const Name = () => {
  const {directorState, dispatch} = useDirectorContext();

  const initialState = {
    fields: {
      name: '',
      abbreviation: '',
      year: (new Date()).getFullYear(),
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);

  const isValid = (fields) => {
    return fields.name.length > 0 && fields.year >= initialState.fields.year
  }

  const inputChanged = (event) => {
    const changedData = {...formData};
    const newValue = event.target.value;
    const fieldName = event.target.name;
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
          <input type={'number'}
                 min={(new Date()).getFullYear()}
                 max={2099}
                 name={'year'}
                 id={'year'}
                 className={'form-control'}
                 value={formData.fields.year}
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