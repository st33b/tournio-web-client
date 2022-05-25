import {Accordion, Placeholder} from "react-bootstrap";

import classes from './ActiveTournament.module.scss';

const Basics = ({tournament, eventKey}) => {
  let content = (
    <Placeholder as={Accordion.Body} animation={'glow'}>
      <Placeholder xs={12}/>
      <Placeholder xs={4}/>{' '}
      <Placeholder xs={8}/>
    </Placeholder>
  );

  if (tournament) {
    content = (
      <Accordion.Body className={classes.AccordionBody}>
        <p>
          {tournament.name}
        </p>
        <p>
          <strong>
            Year:{' '}
          </strong>
          {tournament.year}
        </p>
        <p>
          <strong>
            Starts:{' '}
          </strong>
          {tournament.start_date}
        </p>
      </Accordion.Body>
    );
  }

  return (
    <Accordion.Item eventKey={eventKey} className={classes.Basics}>
      <Accordion.Header as={'h5'} className={classes.AccordionHeader}>
        Basics
      </Accordion.Header>
      {content}
    </Accordion.Item>
  );
}

export default Basics;