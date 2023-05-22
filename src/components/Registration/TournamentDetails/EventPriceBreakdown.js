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

  // Price breakdown:
  // [
  //   {
  //     event,
  //     rows, // each of these is a table row with two cells: price and date text
  //   },
  // ]
  const priceBreakdown = [];
  const eventsByIdentifier = {}; // For use when assembling the bundle discounts

  // build the price/date rows for individual events
  for (const e of events) {
    eventsByIdentifier[e.identifier] = e;

    const discountItem = event_items.ledger.find(({configuration, determination}) =>
      configuration.event === e.identifier && determination === 'early_discount');
    let formattedExpirationDate, formattedLateFeeDate;
    if (discountItem) {
      formattedExpirationDate = formatInTimeZone(new Date(discountItem.configuration.valid_until), timezone, 'PP p z');
    }
    const lateFeeItem = event_items.ledger.find(({configuration, determination}) =>
      configuration.event === e.identifier && determination === 'late_fee');
    if (lateFeeItem) {
      formattedLateFeeDate = formatInTimeZone(new Date(lateFeeItem.configuration.applies_at), timezone, 'PP p z');
    }

    const eventRows = [];

    // Early-discount row
    if (discountItem) {
      eventRows.push(
        <tr className={`${classes.Early}`}>
          <td>
            ${e.value - discountItem.value}
          </td>
          <td>
            Until{' '}
            <span className={classes.Date}>
                    {formattedExpirationDate}
                  </span>
          </td>
        </tr>
      );
    }

    //
    // The "regular" fee row has four possibilities:
    //
    let dateCell = '';
    // There is neither an early discount nor a late fee
    if (!discountItem && !lateFeeItem) {
      // Do nothing; leave regularRow.rows empty
    } else if (discountItem && lateFeeItem) {
      // there's both an early discount and a late fee: Between X and Y
      dateCell = (
        <td>
          Between{' '}
          <span className={classes.Date}>
             {formattedExpirationDate}
          </span>
          {' '}and{' '}
          <span className={classes.Date}>
             {formattedLateFeeDate}
          </span>
        </td>
      );
    } else if (discountItem && !lateFeeItem) {
      // there's an early discount but no late fee: After X
      dateCell = (
        <td>
          After{' '}
          <span className={classes.Date}>
            {formattedExpirationDate}
          </span>
        </td>
      );
    } else {
      // there's a late fee but no early discount: After Y
      dateCell = (
        <td>
          Until{' '}
          <span className={classes.Date}>
            {formattedLateFeeDate}
          </span>
        </td>
      );
    }
    eventRows.push(
      <tr className={`${classes.Regular}`}>
        <td>
          ${e.value}
        </td>
        {dateCell}
      </tr>
    );

    // Now the late fee row
    if (lateFeeItem) {
      eventRows.push(
        <tr className={`${classes.Late}`}>
          <td>
            ${e.value + lateFeeItem.value}
          </td>
          <td>
            After{' '}
            <span className={classes.Date}>
                    {formattedLateFeeDate}
                  </span>
          </td>
        </tr>
      );
    }

    priceBreakdown.push({
      event: e,
      rows: eventRows,
    });
  } // end of building rows for individual events

  const bundleDiscounts = event_items.ledger.filter(({determination}) => determination === 'bundle_discount');


  return (
    <div className={classes.Details}>
      <h6>
        Event Entry Fees
      </h6>
      {priceBreakdown.map(({event, rows}) => (
        <div className={'table-responsive'} key={event.identifier}>
          <table className={`table table-borderless ${classes.FeeTable}`}>
            <thead>
            <tr>
              <th>
                {event.name}
              </th>
              {rows.length == 0 && (
                <th>
                  Entry fee: ${event.value}
                </th>
              )}
            </tr>
            </thead>
            {rows.length > 0 && (
              <tbody>
                {rows}
              </tbody>
            )}
          </table>
        </div>
      ))}
    </div>
  );
}

export default EventPriceBreakdown;
