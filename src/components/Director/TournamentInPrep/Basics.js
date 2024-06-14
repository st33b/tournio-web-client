import Card from 'react-bootstrap/Card';
import {format} from "date-fns";
import {timezones} from "../../../utils";

import classes from './TournamentInPrep.module.scss';
import {useTournament} from "../../../director";

const Basics = () => {
  const {tournament} = useTournament();

  if (!tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Basics
      </Card.Header>
      <Card.Body>
        <dl>
          <div className={'row'}>
            <dt className={'col-4'}>Name</dt>
            <dd className={'col'}>{tournament.name}</dd>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className={'row'}>
              <dt className={'col-4'}>ID</dt>
              <dd className={'col'}>{tournament.id}</dd>
            </div>
          )}
          <div className={'row'}>
            <dt className={'col-4'}>Year</dt>
            <dd className={'col'}>{tournament.year}</dd>
          </div>
          <div className={'row'}>
            <dt className={'col-4'}>Location</dt>
            <dd className={'col'}>{tournament.location}</dd>
          </div>
          <div className={'row'}>
            <dt className={'col-4'}>Timezone</dt>
            <dd className={'col'}>{timezones[tournament.timezone].display}</dd>
          </div>
          <div className={'row'}>
            <dt className={'col-4'}>Entry Deadline</dt>
            <dd className={'col'}>{format(new Date(tournament.entry_deadline), 'PP p')}</dd>
          </div>
          <div className={'row'}>
            <dt className={'col-4'}>Starts</dt>
            <dd className={'col'}>{tournament.start_date}</dd>
          </div>
          <div className={'row'}>
            <dt className={'col-4'}>Ends</dt>
            <dd className={'col'}>{tournament.end_date}</dd>
          </div>
          <div className={'row'}>
            <dt className={'col-4'}>Events</dt>
            <dd className={'col mb-0'}>{tournament.events.map(({name}) => name).join(', ')}</dd>
          </div>
        </dl>
      </Card.Body>
    </Card>
  );
}

export default Basics;
