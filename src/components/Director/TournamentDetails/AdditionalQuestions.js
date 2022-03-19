import {useState} from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import classes from './TournamentDetails.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";
import AdditionalQuestionForm from "../AdditionalQuestionForm/AdditionalQuestionForm";

const additionalQuestions = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  const [editing, setEditing] = useState(false);

  const tournamentHasQuestions = context.tournament.additional_questions.length > 0;
  const editable = context.tournament.state !== 'active' && context.tournament.state !== 'closed';
  const editLink = (
    <a href={'#'}
       className={'ms-auto align-middle'}
       onClick={() => {}}>
      <i className={'bi-pencil-fill'} aria-hidden={true}/>
      <span className={'visually-hidden'}>edit</span>
    </a>
  );

  return (
    <Card className={classes.Card}>
      <Card.Header className={'d-flex'}>
        <h5 className={'fw-light mb-0'}>
          Additional Form Questions
        </h5>
        {tournamentHasQuestions && editable && editLink}
      </Card.Header>
      <ListGroup variant={'flush'}>
        {!tournamentHasQuestions && <ListGroup.Item>None configured</ListGroup.Item>}
        {tournamentHasQuestions && context.tournament.additional_questions.map((q, i) => {
          return (
            <ListGroup.Item key={i}>
              {q.label}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <AdditionalQuestionForm />
    </Card>
  );
}

export default additionalQuestions;