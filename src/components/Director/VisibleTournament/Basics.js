import {Accordion, Placeholder} from "react-bootstrap";

import classes from './VisibleTournament.module.scss';

const Basics = ({tournament, eventKey}) => {
  let content = (
    <Placeholder as={Accordion.Body} animation={'glow'}>
      <Placeholder xs={12}/>
      <Placeholder xs={4}/>{' '}
      <Placeholder xs={8}/>
    </Placeholder>
  );

  const timeZones = {
    'Pacific/Honolulu': {
      key: 'Pacific/Honolulu',
      display: 'Hawaii (HST)',
    },
    'America/Adak': {
      key: 'America/Adak',
      display: 'Hawaii-Aleutian (HST/HDT)',
    },
    'America/Anchorage': {
      key: 'America/Anchorage',
      display: 'Alaska (AKST/AKDT)',
    },
    'America/Los_Angeles': {
      key: 'America/Los_Angeles',
      display: 'Pacific (PST/PDT)',
    },
    'America/Phoenix': {
      key: 'America/Phoenix',
      display: 'Phoenix (MST)',
    },
    'America/Denver': {
      key: 'America/Denver',
      display: 'Mountain (MST/MDT)',
    },
    'America/Chicago': {
      key: 'America/Chicago',
      display: 'Central (CST/CDT)',
    },
    'America/New_York': {
      key: 'America/New_York',
      display: 'Eastern (EST/EDT)',
    },
  }

  if (tournament) {
    content = (
      <Accordion.Body className={classes.AccordionBody}>
        <p>
          {tournament.name}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p>
            <strong>
              ID:{' '}
            </strong>
            {tournament.id}
          </p>
        )}
        <p>
          <strong>
            Year:{' '}
          </strong>
          {tournament.year}
        </p>
        <p>
          <strong>
            Location:{' '}
          </strong>
          {tournament.location}
        </p>
        <p>
          <strong>
            Timezone:{' '}
          </strong>
          {timeZones[tournament.timezone].display}
        </p>
        <p>
          <strong>
            Starts:{' '}
          </strong>
          {tournament.start_date}
        </p>
        <p>
          <strong>
            Ends:{' '}
          </strong>
          {tournament.end_date}
        </p>
        <p>
          <strong>
            Entry deadline:{' '}
          </strong>
          {tournament.entry_deadline}
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