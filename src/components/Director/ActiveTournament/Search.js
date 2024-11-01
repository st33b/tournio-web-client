import classes from './ActiveTournament.module.scss';
import {useState} from "react";

const Search = ({onSubmit}) => {
  const initialFormState = {
    value: '',
    submitted: false,
  }

  const [formState, setFormState] = useState(initialFormState);

  const formSubmitted = (event) => {
    event.preventDefault();
    onSubmit(formState.value);
    setFormState({
      value: formState.value,
      submitted: true,
    });
  }

  const inputChanged = (event) => {
    const newValue = event.target.value;
    const newFormState = {
      value: newValue,
      submitted: formState.submitted,
    }
    setFormState(newFormState);
  }

  return (
    <div className={classes.Search}>
      <form noValidate={true} onSubmit={formSubmitted}>

        <div className={`input-group`}>
          <span className={`input-group-text`} aria-hidden={true}>
            {!formState.submitted && <i className={'bi bi-search'}/>}
            {formState.submitted && (
              <span className={`spinner-grow ${classes.Spinner}`}
                    aria-hidden={true}
                    role={'status'}>
              </span>
            )}
          </span>
          <div className={`form-floating`}>
            <input type={'text'}
                   className={`form-control`}
                   id={`searchInput`}
                   name={`searchTerms`}
                   value={formState.value}
                   onChange={inputChanged}
                   disabled={formState.submitted}
                   placeholder={`Search`}/>
            <label htmlFor='searchInput'>
              Search
            </label>
          </div>
        </div>

        <div className={`form-text ${classes.Helper}`}>
          <i className={'bi bi-arrow-return-left pe-2'} aria-hidden={true}/>
          <span className={'visually-hidden'}>
            Hit Return/Enter
          </span>
          to submit
        </div>

      </form>
    </div>
  )
}

export default Search;
