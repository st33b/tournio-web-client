import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import classes from './TournamentDetails.module.scss';

const additionalQuestions = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h4'}>
        Additional Form Questions
      </Card.Header>
      <ListGroup variant={'flush'}>
        {tournament.additional_questions.length === 0
          ? <ListGroup.Item>None configured</ListGroup.Item>
          : tournament.additional_questions.map((q, i) => {
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