import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import classes from './TournamentDetails.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";

const additionalQuestions = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h4'}>
        Additional Form Questions
      </Card.Header>
      <ListGroup variant={'flush'}>
        {context.tournament.additional_questions.length === 0
          ? <ListGroup.Item>None configured</ListGroup.Item>
          : context.tournament.additional_questions.map((q, i) => {
          return (
            <ListGroup.Item key={i}>
              {q.label}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}

export default additionalQuestions;