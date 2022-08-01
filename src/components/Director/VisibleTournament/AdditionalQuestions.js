import ListGroup from "react-bootstrap/ListGroup";
import {Accordion, Placeholder} from "react-bootstrap";

import classes from './VisibleTournament.module.scss';

const AdditionalQuestions = ({eventKey, tournament}) => {
  let content = (
    <Placeholder animation={'glow'}>
      <Placeholder xs={3} />{' '}
      <Placeholder xs={8} />
      <Placeholder xs={4} />{' '}
      <Placeholder xs={7} />
    </Placeholder>
  )
  if (tournament) {
    const list = (
      tournament.additional_questions.map((q, i) => {
        return (
          <ListGroup.Item key={i} className={classes.ListItem}>
            <strong>
              {q.order}{': '}
            </strong>
            {q.label}
          </ListGroup.Item>
        );
      })
    );
    content = (
      <ListGroup variant={'flush'}>
        {list.length === 0 && <ListGroup.Item className={classes.ListItem}>None configured</ListGroup.Item>}
        {list}
      </ListGroup>
    );
  }

  return (
    <Accordion.Item eventKey={eventKey} className={classes.AdditionalQuestions}>
      <Accordion.Header as={'h5'} className={classes.AccordionHeader}>
        Additional Questions
      </Accordion.Header>
      <Accordion.Body className={`${classes.AccordionBody} py-1`}>
        {content}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default AdditionalQuestions;