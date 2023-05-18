import {useEffect, useState} from "react";

import ErrorBoundary from "../../common/ErrorBoundary";
import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import {
  additionalQuestionAdded,
  additionalQuestionUpdated,
  additionalQuestionDeleted
} from "../../../store/actions/directorActions";

import classes from './AdditionalQuestionForm.module.scss';
import ButtonRow from "../../common/ButtonRow";
import Card from "react-bootstrap/Card";

const AdditionalQuestionForm = ({tournament, question, newQuestion}) => {
  const context = useDirectorContext();

  const initialFormData = {
    extended_form_field_id: '',
    required: false,
    valid: false,
  }
  const [formData, setFormData] = useState(initialFormData);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({...question});
    }
  }, [question, newQuestion]);

  const availableQuestions = tournament.available_questions;
  const roomForMore = availableQuestions.length > 0;
  const tooLate = tournament.state === 'active' || tournament.state === 'closed';

  const inputChanged = (event) => {
    const inputName = event.target.name;
    const newValue = inputName === 'required' ? event.target.checked : event.target.value;
    const newFormData = {...formData}
    newFormData[inputName] = newValue;

    newFormData.valid = !!newFormData.extended_form_field_id;

    setFormData(newFormData);
  }

  const onSuccess = (data) => {
    if (newQuestion) {
      context.dispatch(additionalQuestionAdded(data));
    } else {
      context.dispatch(additionalQuestionUpdated(data));
    }
    setEditing(false);
  }

  const onFailure = (data) => {
    // We never fail! hahaha
  }

  const formSubmitted = (event) => {
    event.preventDefault();

    if (!formData.valid) {
      return;
    }

    // send over the new question
    const uri = newQuestion ? `/director/tournaments/${tournament.identifier}/additional_questions` : `/director/additional_questions/${question.identifier}`;
    const requestConfig = {
      method: newQuestion ? 'post' : 'patch',
      data: {
        additional_question: {
          extended_form_field_id: formData.extended_form_field_id,
          validation_rules: {
            required: formData.required,
          },
          order: tournament.additional_questions.length + 1,
        },
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: onSuccess,
      onFailure: onFailure,
    });
  }

  const editClicked = (event) => {
    event.preventDefault();
    setEditing(true);
  }

  const outerClasses = [classes.AdditionalQuestionForm];
  if (editing) {
    outerClasses.push(classes.Editing);
  }

  return (
    <ErrorBoundary>
      <div className={outerClasses.join(' ')}>
        {editing &&
          <Card.Body>
            <form onSubmit={formSubmitted}>
              <div className={'row'}>
                <div className={'col-12'}>
                  <select className={'form-select'}
                          onChange={inputChanged}
                          name={'extended_form_field_id'}>
                    <option value={''}>
                      -- Choose a question
                    </option>
                    {availableQuestions.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
                  </select>
                </div>
              </div>
              <div className={`row`}>
                <div className={'col-12'}>
                  <div className={'form-check form-switch my-3'}>
                    <input className={'form-check-input'}
                           type={'checkbox'}
                           role={'switch'}
                           name={'required'}
                           onChange={inputChanged}
                           id={'response_required'}/>
                    <label className={'form-check-label'}
                           htmlFor={'response_required'}>
                      Require a response
                    </label>
                  </div>
                </div>
              </div>

              <ButtonRow onCancel={() => setEditing(false)} disableSave={!formData.valid} />
            </form>
          </Card.Body>
        }
        {!editing && roomForMore &&
          <Card.Body>
            <div className={'text-center'}>
              <button type={'button'}
                      className={'btn btn-outline-primary'}
                      role={'button'}
                      onClick={() => setEditing(true)}>
                <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
                Add
              </button>
            </div>
          </Card.Body>
        }
        {!roomForMore && !tooLate &&
          <div className={'text-center'}>
            <button type={'button'}
                    className={'btn btn-outline-secondary'}
                    disabled
                    role={'button'}>
              <i className={'bi-slash-circle'} aria-hidden={true}/>{' '}
              No more questions available
            </button>
          </div>
        }
        {tooLate &&
          <Card.Body>
            <div className={'text-center'}
                 title={'Cannot add questions once registration is open'}>
              <button type={'button'}
                      className={'btn btn-outline-secondary'}
                      disabled
                      role={'button'}>
                <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
                Add
              </button>
            </div>
          </Card.Body>
        }
      </div>
    </ErrorBoundary>
  );
}

export default AdditionalQuestionForm;
