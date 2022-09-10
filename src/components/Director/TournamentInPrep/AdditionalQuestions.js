import {useState, useEffect} from "react";
import {useRouter} from "next/router";
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import {useDirectorContext} from "../../../store/DirectorContext";
import AdditionalQuestionForm from "../AdditionalQuestionForm/AdditionalQuestionForm";
import {directorApiRequest} from "../../../utils";

import classes from './AdditionalQuestions.module.scss';
import {additionalQuestionsUpdated} from "../../../store/actions/directorActions";

const AdditionalQuestions = ({tournament}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialSaveData = {
    questions: [],
    valid: true, // currently, no validity is enforced, so it's always true
  }

  const [editing, setEditing] = useState(false);
  const [saveData, setSaveData] = useState(initialSaveData);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const tournamentHasQuestions = tournament.additional_questions.length > 0;

  useEffect(() => {
    if (!context || !tournament) {
      return;
    }

    const dataFromContext = {
      questions: tournament.additional_questions.map(q => ({ id: q.id, order: q.order, _destroy: false })),
      valid: true,
    };
    setSaveData(dataFromContext);
  }, [context, tournament]);

  if (!context || !tournament) {
    return '';
  }

  const editClicked = (event) => {
    event.preventDefault();
    setEditing(true);
  }

  const onSaveSuccess = (data) => {
    setEditing(false);
    setSuccessMessage(
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center my-2'} role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          Questions saved.
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setSuccessMessage(null)}
                  aria-label="Close" />
        </div>
      </div>
    );
    context.dispatch(additionalQuestionsUpdated(data));
  }

  const onSaveFailure = (data) => {
    console.log(':(', data);
    setErrorMessage(
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center my-2'} role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          Failed to save: {data.error}
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setErrorMessage(null)}
                  aria-label="Close" />
        </div>
      </div>
    );
  }

  const saveClicked = (event) => {
    event.preventDefault();

    const patchData = {
      tournament: {
        additional_questions_attributes: saveData.questions,
      }
    }
    const uri = `/director/tournaments/${tournament.identifier}`;
    const requestConfig = {
      method: 'patch',
      data: patchData,
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: onSaveSuccess,
      onFailure: onSaveFailure,
    })
  }

  const inputChanged = (event, i) => {
    const newSaveData = {...saveData};
    newSaveData.questions[i].order = parseInt(event.target.value);
    setSaveData(newSaveData);
  }

  const deleteClicked = (event, i) => {
    event.preventDefault();
    const newSaveData = {...saveData};
    newSaveData.questions[i]._destroy = true;
    setSaveData(newSaveData);
  }

  let list = '';
  if (editing) {
    list = (
      tournament.additional_questions.map((q, i) => {
        const str = q.label.length < 25 ? q.label : q.label.substring(0, 25).concat('...');
        if (!saveData.questions[i] || saveData.questions[i]._destroy) {
          return '';
        }
        return (
          <ListGroup.Item key={i} className={'d-flex justify-content-start'}>
            <input type={'number'}
                   value={saveData.questions[i].order}
                   onChange={(event) => inputChanged(event, i)}
                   min={1}
                   max={tournament.additional_questions.length}
                   className={`${classes.OrderInput} form-control`}
                   name={`aq-order-${i}`}
                   id={`aq-order-${i}`}
                   title={'blah blah'}
                   />
            <div className={'form-control-plaintext ms-3'}>
              {str}
            </div>
            <div title={'delete'} className={'ms-auto'}>
              <a className={'text-danger form-control-plaintext'}
                      href={'#'}
                      onClick={(event) => deleteClicked(event, i)}>
                <i className={'bi-x-circle-fill'} aria-hidden={true} />
                <span className={'visually-hidden'}>Delete</span>
              </a>
            </div>
          </ListGroup.Item>
        );
      })
    )
  } else {
    list = (
      tournament.additional_questions.map((q, i) => {
        if (saveData.questions[i] && saveData.questions[i]._destroy) {
          return '';
        }
        return (
          <ListGroup.Item key={i}>
            <strong>
              {q.order}{': '}
            </strong>
            {q.label}
          </ListGroup.Item>
        );
      })
    );
  }

  if (successMessage) {
    list.push(<ListGroup.Item key={list.length + 1}>{successMessage}</ListGroup.Item>);
  }
  if (errorMessage) {
    list.push(<ListGroup.Item key={list.length + 1}>{errorMessage}</ListGroup.Item>);
  }

  const editLink = (
    <button
      className={`${classes.EditIcon} btn btn-sm btn-outline-primary ms-auto align-middle`}
      onClick={editClicked}>
      <i className={'bi-pencil'} aria-hidden={true}/>
      <span className={'visually-hidden'}>edit</span>
    </button>
  );

  const saveLink = (
    <button
      className={`${classes.SaveIcon} btn btn-sm btn-secondary ms-auto align-middle`}
      disabled={!saveData.valid}
      onClick={saveClicked}>
      <i className={'bi-pencil-fill'} aria-hidden={true}/>
      <span className={'visually-hidden'}>save</span>
    </button>
  );

  return (
    <div className={classes.AdditionalQuestions}>
      <Card className={classes.Card}>
        <Card.Header className={'d-flex'}>
          <h5 className={'fw-light mb-0 mt-1'}>
            Additional Form Questions
          </h5>
          {tournamentHasQuestions && !editing && editLink}
          {editing && saveLink}
        </Card.Header>
        <ListGroup variant={'flush'}>
          {!tournamentHasQuestions && <ListGroup.Item>None configured</ListGroup.Item>}
          {tournamentHasQuestions && list}
        </ListGroup>
        <AdditionalQuestionForm tournament={tournament}/>
      </Card>
    </div>
  );
}

export default AdditionalQuestions;