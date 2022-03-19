import {useState} from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
// import {DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {useDirectorContext} from "../../../store/DirectorContext";
import AdditionalQuestionForm from "../AdditionalQuestionForm/AdditionalQuestionForm";

import classes from './AdditionalQuestions.module.scss';

const additionalQuestions = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  const [editing, setEditing] = useState(false);

  const tournamentHasQuestions = context.tournament.additional_questions.length > 0;
  const editable = context.tournament.state !== 'active' && context.tournament.state !== 'closed';

  const editClicked = (event) => {
    event.preventDefault();
    setEditing(true);
  }

  const saveClicked = (event) => {
    event.preventDefault();
    setEditing(false);
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
       onClick={saveClicked}>
      <i className={'bi-pencil-fill'} aria-hidden={true}/>
      <span className={'visually-hidden'}>save</span>
    </button>
  )

  let list = (
    context.tournament.additional_questions.map((q, i) => (
      <ListGroup.Item key={i}>
        {q.label}
      </ListGroup.Item>
    ))
  );
  if (editing) {
    list = (
      context.tournament.additional_questions.map((q, i) => {
        const str = q.label.length < 30 ? q.label : q.label.substring(0, 30).concat('...');
        return (
          <ListGroup.Item key={i} className={'d-flex justify-content-start'}>
            <div className={classes.GrabHandle}>
              <i className={'bi-chevron-expand pe-3'} aria-hidden={true}/>
              <span className={'visually-hidden'}>Reorder</span>
            </div>
            <div>
              {str}
            </div>
            <div title={'delete'} className={'ms-auto'}>
              <a className={'text-danger'}
                      href={'#'}
                      onClick={() => {}}>
                <i className={'bi-x-circle-fill'} aria-hidden={true} />
                <span className={'visually-hidden'}>Delete</span>
              </a>
            </div>
          </ListGroup.Item>
        );
      })
    )
  }

  return (
    <div className={classes.AdditionalQuestions}>
      <Card className={classes.Card}>
        <Card.Header className={'d-flex'}>
          <h5 className={'fw-light mb-0 mt-1'}>
            Additional Form Questions
          </h5>
          {tournamentHasQuestions && editable && !editing && editLink}
          {editing && saveLink}
        </Card.Header>
        <ListGroup variant={'flush'}>
          {!tournamentHasQuestions && <ListGroup.Item>None configured</ListGroup.Item>}
          {tournamentHasQuestions && list}
        </ListGroup>
        <AdditionalQuestionForm/>
      </Card>
    </div>
  );
}

export default additionalQuestions;