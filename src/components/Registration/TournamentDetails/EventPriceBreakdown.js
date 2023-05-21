import {formatInTimeZone} from 'date-fns-tz';

import classes from './TournamentDetails.module.scss';
import {devConsoleLog} from "../../../utils";

const EventPriceBreakdown = ({tournament}) => {
  if (!tournament) {
    return;
  }
  const {timezone, event_items} = {...tournament};
  if (!event_items) {
    return '';
  }

  // Event Entry Fees
  //
  // Event A
  //   $XX until AAAA
  //   $YY between AAAA and CCCC
  //   $ZZ after CCCC
  // Event B
  //   $XX until AAAA
  //   $YY between AAAA and CCCC
  //   $ZZ after CCCC

  // Event A & Event B
  //   $CCC until AAAA
  //   $DDD between AAAA and CCCC
  //   $EEE after CCCC

  const events = event_items.event;
  const ledgerItems = event_items.ledger;

  const eventsAndLedgers = events.map(event => {
    const eventDeets = {
      event: event,
      ledgers: {},
      dates: {},
    };
    for (const item of ledgerItems) {
      if (item.configuration.event !== event.identifier) {
        continue;
      }
      eventDeets.ledgers[item.determination] = item.value;
      if (item.determination === 'early_discount') {
        eventDeets.dates.earlyEnds = formatInTimeZone(new Date(item.configuration.valid_until), timezone,'PP p z');
      } else if (item.determination === 'late_fee') {
        eventDeets.dates.lateStarts = formatInTimeZone(new Date(item.configuration.applies_at), timezone,'PP p z');
      }
    }
    return eventDeets;
  });

  devConsoleLog("breakdown:", eventsAndLedgers);

  const discounts = ledgerItems.filter(({determination}) => determination === 'bundle_discount');
  const discountDeets = discounts.map(({configuration, value}) => {
    
    return {};
  })


  // Bundles

  return (
    <div className={classes.Details}>
      <h6>
        Event Entry Fees
      </h6>
      {eventsAndLedgers.map(({event, ledgers, dates}) => (
        <div className={'table-responsive'} key={event.identifier}>
          <table className={`table table-borderless ${classes.FeeTable}`}>
            <thead>
              <tr>
                <th>
                  {event.name}
                </th>
                {!dates.earlyEnds && !dates.lateStarts && (
                  <th>
                    Entry fee: ${event.value}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
            {dates.earlyEnds && (
              <tr className={`${classes.Early}`}>
                <td>
                  ${event.value - ledgers.early_discount}
                </td>
                <td>
                  Until{' '}
                  <span className={classes.Date}>
                    {dates.earlyEnds}
                  </span>
                </td>
              </tr>
            )}
            <tr className={`${classes.Regular}`}>
              <td>
                ${event.value}
              </td>
              {/* If we have both early registration discount and and late fee */}
              {dates.earlyEnds && dates.lateStarts && (
                <td>
                  Between{' '}
                  <span className={classes.Date}>
                    {dates.earlyEnds}
                    </span>
                  {' '}and{' '}
                  <span className={classes.Date}>
                    {dates.lateStarts}
                  </span>
                </td>
              )}
              {/* If we have no early discount but we do have a late fee */}
              {!dates.esrlyEnds && dates.lateStarts && (
                <td>
                  Until{' '}
                  <span className={classes.Date}>
                    {dates.lateStarts}
                  </span>
                </td>
              )}
              {/* If we have an early discount but no late fee*/}
              {dates.earlyEnds && !dates.lateStarts && (
                <td>
                  After{' '}
                  <span className={classes.Date}>
                    {dates.earlyEnds}
                  </span>
                </td>
              )}
            </tr>
            {dates.lateStarts && (
              <tr className={`${classes.Late}`}>
                <td>
                  ${event.value + ledgers.late_fee}
                </td>
                <td>
                  After{' '}
                  <span className={classes.Date}>
                    {dates.lateStarts}
                  </span>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default EventPriceBreakdown;
