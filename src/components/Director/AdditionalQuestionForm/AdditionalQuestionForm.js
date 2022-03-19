import {useState} from "react";

import classes from './AdditionalQuestionForm.module.scss';

const additionalQuestionForm = ({availableQuestions}) => {

  const initialFormData = {
    extended_form_field_id: '',
    required: false,
  }
  const [formData, setFormData] = useState(initialFormData);
  const [formDisplayed, setFormDisplayed] = useState(false);

  const addClicked = (event) => {
    event.preventDefault();
    setFormDisplayed(true);
  }

  const inputChanged = (event) => {
    const inputName = event.target.name;
    const newValue = inputName === 'required' ? event.target.checked : event.target.value;
    const newFormData = { ...formData }
    newFormData[inputName] = newValue;
    setFormData(newFormData);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    console.log(formData);

    // send over the new question

    // make sure the response gives us enough information to update the tournament in context:
    // - remove it from available questions
    // - add it to the tournament's additional questions

    // that should trigger a re-render of this component
    setFormDisplayed(false);
  }

  return (
    <div className={classes.AdditionalQuestionForm}>
      {formDisplayed &&
        <form onSubmit={formSubmitted}>
          <select className={'form-select'}
                  onChange={inputChanged}
                  name={'extended_form_field_id'}>
            <option value={''}>
              -- Choose a question
            </option>
            {availableQuestions.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
          </select>
          <div className={'form-check form-switch my-3'}>
            <input className={'form-check-input'}
                   type={'checkbox'}
                   role={'switch'}
                   name={'required'}
                   onChange={inputChanged}
                   id={'response_required'}/>
            <label className={'form-check-label'}
                   htmlFor={'response_required'}>
              A response is required
            </label>
          </div>
          <div className={'text-center'}>
            <button type={'submit'}
                    className={'btn btn-primary'}>
              Save
            </button>
          </div>
        </form>
      }
      {!formDisplayed &&
        <div className={'text-center'}>
          <button type={'button'}
                  className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={addClicked}>
            <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
            Add
          </button>
        </div>
      }
    </div>
  );
}

export default additionalQuestionForm;