import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import AdditionalQuestionForm from "../AdditionalQuestionForm/AdditionalQuestionForm";

import classes from './TournamentInPrep.module.scss';

const AdditionalQuestions = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card className={`${classes.Card}`}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Additional Questions
      </Card.Header>
      <ListGroup variant={'flush'}>
        {tournament.additional_questions.map((question, i) => (
          <ListGroup.Item key={i} className={`p-0`}>
            <AdditionalQuestionForm tournament={tournament} question={question} />
          </ListGroup.Item>
        ))}
        <ListGroup.Item className={'p-0'}>
          <AdditionalQuestionForm tournament={tournament} newQuestion={true}/>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );

}

export default AdditionalQuestions;
