import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import AdditionalQuestionForm from "../AdditionalQuestionForm/AdditionalQuestionForm";

import classes from './TournamentInPrep.module.scss';
import {useTournament} from "../../../director";

const AdditionalQuestions = () => {
  const {tournament} = useTournament();

  if (!tournament) {
    return '';
  }

  return (
    <Card className={`${classes.Card}`}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Additional Questions
      </Card.Header>
      <ListGroup variant={'flush'}>
        {Object.values(tournament.additional_questions).map((question, i) => (
          <ListGroup.Item key={i} className={`p-0`}>
            <AdditionalQuestionForm question={question} />
          </ListGroup.Item>
        ))}
        <ListGroup.Item className={'p-0'}>
          <AdditionalQuestionForm newQuestion={true}/>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );

}

export default AdditionalQuestions;
