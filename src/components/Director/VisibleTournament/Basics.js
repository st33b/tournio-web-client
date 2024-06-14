import {Accordion, Placeholder} from "react-bootstrap";
import {timezones} from "../../../utils";

import classes from './VisibleTournament.module.scss';
import {useTournament} from "../../../director";

const Basics = ({eventKey}) => {
  const {loading, tournament} = useTournament();

  let content = (
    <Placeholder as={Accordion.Body} animation={'glow'}>
      <Placeholder xs={12}/>
      <Placeholder xs={4}/>{' '}
      <Placeholder xs={8}/>
    </Placeholder>
  );

  if (!loading) {
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
          {timezones[tournament.timezone].display}
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
        <p>
          <strong>
            Events:{' '}
          </strong>
          {tournament.events.map(({name}) => name).join(', ')}
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
