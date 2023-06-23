import {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";

import ErrorBoundary from "../../common/ErrorBoundary";
import ButtonRow from "../../common/ButtonRow";
import {directorApiRequest, useTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import {updateObject} from "../../../utils";

import classes from './AdditionalQuestionForm.module.scss';

const AdditionalQuestionForm = ({question, newQuestion}) => {
  const {authToken} = useLoginContext();
  const {tournament, tournamentUpdatedQuietly} = useTournament();

  const initialFormData = {
    extended_form_field_id: '',
    order: '',
    required: false,
    valid: false,
  }
  const [formData, setFormData] = useState(initialFormData);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({
        extended_form_field_id: question.extended_form_field_id,
        order: question.order,
        required: question.validation.required,
        valid: true,
      });
    }
  }, [question, newQuestion]);

  const inputChanged = (event) => {
    const inputName = event.target.name;
    const newValue = inputName === 'required' ? event.target.checked : event.target.value;
    const newFormData = {...formData}
    newFormData[inputName] = newValue;

    newFormData.valid = !!newFormData.extended_form_field_id;

    setFormData(newFormData);
  }

  const onSuccess = (data) => {
    let modifiedTournament;
    if (newQuestion) {
      modifiedTournament = updateObject(tournament, {
        additional_questions: tournament.additional_questions.concat(data),
        available_questions: tournament.available_questions.filter(
          ({id}) => id !== data.extended_form_field_id
        ),
      });
    } else {
      const qId = data.identifier;
      const index = tournament.additional_questions.findIndex(c => c.identifier === qId);
      const updatedQuestion = {
        ...tournament.additional_questions[index],
        ...data,
      }
      const newQuestions = [...tournament.additional_questions];
      newQuestions[index] = updatedQuestion;
      modifiedTournament = updateObject(tournament, {
        additional_questions: newQuestions,
      });
    }
    setFormData(initialFormData);
    tournamentUpdatedQuietly(modifiedTournament);
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
    const uri = newQuestion ? `/tournaments/${tournament.identifier}/additional_questions` : `/additional_questions/${question.identifier}`;
    const requestConfig = {
      method: newQuestion ? 'post' : 'patch',
      data: {
        additional_question: {
          validation_rules: {
            required: formData.required,
          },
          order: formData.order,
        },
      },
    };
    if (newQuestion) {
      requestConfig.data.additional_question.extended_form_field_id = formData.extended_form_field_id;
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: onSuccess,
      onFailure: onFailure,
    });
  }

  const editClicked = (event) => {
    event.preventDefault();
    setEditing(true);
  }

  const onDeleteSuccess = () => {
    const qId = question.identifier;
    const newQuestionSet = tournament.additional_questions.filter(i => {
      return i.identifier !== qId;
    })
    const restoredAvailableQuestion = {
      id: question.extended_form_field_id,
      label: question.label,
      name: question.name,
      validation_rules: question.validation,
    }
    const modifiedTournament = updateObject(tournament, {
      additional_questions: newQuestionSet,
      available_questions: tournament.available_questions.concat(restoredAvailableQuestion),
    });

    tournamentUpdatedQuietly(modifiedTournament);
    setEditing(false);
    setFormData(initialFormData);
  }

  const deleteClicked = (event) => {
    event.preventDefault();
    const uri = `/additional_questions/${question.identifier}`
    const requestConfig = {
      method: 'delete',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: onDeleteSuccess,
      onFailure: (data) => console.log("D'oh!", data),
    });
  }

  if (!tournament) {
    return '';
  }

  const availableQuestions = tournament.available_questions;
  const roomForMore = availableQuestions.length > 0;

  const outerClasses = [classes.AdditionalQuestionForm];
  if (editing) {
    outerClasses.push(classes.Editing);
  }

  return (
    <ErrorBoundary>
      <div className={outerClasses.join(' ')}>
        {/* Form for creating/editing a question */}
        {editing &&
          <Card.Body>
            <form onSubmit={formSubmitted}>
              <div className={'row'}>
                <div className={'col-12'}>
                  {newQuestion &&
                    <select className={'form-select'}
                            onChange={inputChanged}
                            value={formData.extended_form_field_id}
                            name={'extended_form_field_id'}>
                      <option value={''}>
                        -- Choose a question
                      </option>
                      {availableQuestions.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
                    </select>
                  }
                  {!newQuestion &&
                    <Card.Text className={'text-center fw-bold'}>
                      {question.label}
                    </Card.Text>
                  }
                </div>
              </div>

              <div className={`row`}>
                <div className={'col-12'}>
                  <div className={'form-check form-switch my-3'}>
                    <input className={'form-check-input'}
                           type={'checkbox'}
                           role={'switch'}
                           name={'required'}
                           checked={formData.required}
                           onChange={inputChanged}
                           id={'response_required'}/>
                    <label className={'form-check-label'}
                           htmlFor={'response_required'}>
                      Require a response
                    </label>
                  </div>
                </div>
              </div>

              <div className={`row mb-3`}>
                <div className={'col-6'}>
                  <label className={'form-label'}
                         htmlFor={'order'}>
                    Place in order
                  </label>
                </div>
                <div className={'col-6'}>
                  <input className={'form-control'}
                         type={'number'}
                         min={1}
                         name={'order'}
                         value={formData.order}
                         onChange={inputChanged}
                         id={'order'}/>
                </div>
              </div>

              <ButtonRow onCancel={() => setEditing(false)}
                         disableSave={!formData.valid}
                         onDelete={question ? deleteClicked : false}/>
            </form>
          </Card.Body>
        }

        {/* Writing out the content of a question, but not editing it */}
        {!editing && question && !newQuestion &&
          <Card.Body className={classes.Detail}>
            <Card.Text>
              <a href={'#'}
                 className={'text-body text-decoration-none stretched-link'}
                 onClick={editClicked}
                 title={'Update question details'}>
                <strong>
                  {question.order}{': '}
                </strong>
                {question.label}
                {question.validation.required &&
                  <span className={classes.Required}>
                    {' '}(required)
                  </span>
                }
              </a>
            </Card.Text>
          </Card.Body>
        }

        {/* Is this the button to add a new one? */}
        {!editing && newQuestion && roomForMore &&
          <Card.Body className={'text-center'}>
            <button type={'button'}
                    className={'btn btn-outline-primary'}
                    role={'button'}
                    onClick={() => setEditing(true)}>
              <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
              Add
            </button>
          </Card.Body>
        }

        {/* No more questions for you! */}
        {!editing && newQuestion && !roomForMore &&
          <Card.Body className={'text-center'}>
            <button type={'button'}
                    className={'btn btn-outline-secondary'}
                    disabled
                    role={'button'}>
              <i className={'bi-slash-circle'} aria-hidden={true}/>{' '}
              No more questions available
            </button>
          </Card.Body>
        }
      </div>
    </ErrorBoundary>
  );
}

export default AdditionalQuestionForm;
