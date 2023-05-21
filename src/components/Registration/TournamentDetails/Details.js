import {formatInTimeZone} from 'date-fns-tz';

import classes from './TournamentDetails.module.scss';
import TraditionalPriceBreakdown from "./TraditionalPriceBreakdown";
import EventPriceBreakdown from "./EventPriceBreakdown";

const Details = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const formattedDeadline = formatInTimeZone(new Date(tournament.entry_deadline), tournament.timezone,'PP p z');

  return (
    <div className={classes.Details}>
      <p className={'my-3'}>
        <strong>
          Entry Deadline:{' '}
        </strong>
        {formattedDeadline}
      </p>
      <TraditionalPriceBreakdown tournament={tournament}/>
      <EventPriceBreakdown tournament={tournament}/>
      {/*<EventPriceBreakdown events={tournament.event_items.event}*/}
      {/*                     ledgerItems={tournament.event_items.ledger}*/}
      {/*                     timezone={tournament.timezone}/>*/}
    </div>
  )
}

export default Details;
