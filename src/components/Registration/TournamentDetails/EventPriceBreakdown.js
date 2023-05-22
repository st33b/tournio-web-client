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
    let formattedDiscountTime, formattedLateFeeTime;
    if (discountItem) {
      formattedDiscountTime = formatInTimeZone(new Date(discountItem.configuration.valid_until), timezone, 'PP p z');
    }
    const lateFeeItem = event_items.ledger.find(({configuration, determination}) =>
      configuration.event === e.identifier && determination === 'late_fee');
    if (lateFeeItem) {
      formattedLateFeeTime = formatInTimeZone(new Date(lateFeeItem.configuration.applies_at), timezone, 'PP p z');
    }

    const eventRows = [];

    // Early-discount row
    if (discountItem) {
      eventRows.push(
        <tr className={`${classes.Early}`} key={`${e.identifier}-early`}>
          <td>
            ${e.value - discountItem.value}
          </td>
          <td>
            Until{' '}
            <span className={classes.Date}>
                    {formattedDiscountTime}
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
      // Leave regularRow.rows empty
    } else if (discountItem && lateFeeItem) {
      // there's both an early discount and a late fee: Between X and Y
      dateCell = (
        <td>
          Between{' '}
          <span className={classes.Date}>
             {formattedDiscountTime}
          </span>
          {' '}and{' '}
          <span className={classes.Date}>
             {formattedLateFeeTime}
          </span>
        </td>
      );
    } else if (discountItem && !lateFeeItem) {
      // there's an early discount but no late fee: After X
      dateCell = (
        <td>
          After{' '}
          <span className={classes.Date}>
            {formattedDiscountTime}
          </span>
        </td>
      );
    } else {
      // there's a late fee but no early discount: After Y
      dateCell = (
        <td>
          Until{' '}
          <span className={classes.Date}>
            {formattedLateFeeTime}
          </span>
        </td>
      );
    }
    if (dateCell) {
      eventRows.push(
        <tr className={`${classes.Regular}`} key={`${e.identifier}-regular`}>
          <td>
            ${e.value}
          </td>
          {dateCell}
        </tr>
      );
    }

    // Now the late fee row
    if (lateFeeItem) {
      eventRows.push(
        <tr className={`${classes.Late}`} key={`${e.identifier}-late`}>
          <td>
            ${e.value + lateFeeItem.value}
          </td>
          <td>
            After{' '}
            <span className={classes.Date}>
                    {formattedLateFeeTime}
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
  const bundleBreakdowns = bundleDiscounts.map((bundle, bundleIndex) => {
    const bundleDiscount = bundle.value;
    const name = bundle.configuration.events.map(eId => eventsByIdentifier[eId].name).join(' + ') + ' bundle';
    let formattedDiscountTime, formattedLateFeeTime = '';
    const bundleRegularPrice = bundle.configuration.events.map(eId => eventsByIdentifier[eId].value).reduce(
      (acc, current) => acc + current,
      0
    ) - bundleDiscount;
    const bundleEarlyDiscount = bundle.configuration.events.map(eId => {
      const discountItem = event_items.ledger.find(item => (item.determination === 'early_discount' && item.configuration.event === eId));
      if (discountItem) {
        formattedDiscountTime = formatInTimeZone(new Date(discountItem.configuration.valid_until), timezone, 'PP p z');
        return discountItem.value;
      }
      return 0;
    }).reduce((acc, current) => acc + current);
    const bundleLateFee = bundle.configuration.events.map(eId => {
      const feeItem = event_items.ledger.find(item => (item.determination === 'late_fee' && item.configuration.event === eId));
      if (feeItem) {
        formattedLateFeeTime = formatInTimeZone(new Date(feeItem.configuration.applies_at), timezone, 'PP p z');
        return feeItem.value;
      }
      return 0;
    }).reduce((acc, current) => acc + current);

    const bundleRows = [];

    // Early-discount row
    if (bundleEarlyDiscount) {
      bundleRows.push(
        <tr className={`${classes.Early}`} key={`${bundleIndex}-early`}>
          <td>
            ${bundleRegularPrice - bundleEarlyDiscount}
          </td>
          <td>
            Until{' '}
            <span className={classes.Date}>
                    {formattedDiscountTime}
                  </span>
          </td>
        </tr>
      );
    }

    // Regular-price row
    //
    // The "regular" fee row has four possibilities:
    //
    let dateCell = '';
    // There is neither an early discount nor a late fee
    if (!bundleEarlyDiscount && !bundleLateFee) {
      // Leave regularRow.rows empty
    } else if (bundleEarlyDiscount && bundleLateFee) {
      // there's both an early discount and a late fee: Between X and Y
      dateCell = (
        <td>
          Between{' '}
          <span className={classes.Date}>
             {formattedDiscountTime}
          </span>
          {' '}and{' '}
          <span className={classes.Date}>
             {formattedLateFeeTime}
          </span>
        </td>
      );
    } else if (bundleEarlyDiscount && !bundleLateFee) {
      // there's an early discount but no late fee: After X
      dateCell = (
        <td>
          After{' '}
          <span className={classes.Date}>
            {formattedDiscountTime}
          </span>
        </td>
      );
    } else {
      // there's a late fee but no early discount: After Y
      dateCell = (
        <td>
          Until{' '}
          <span className={classes.Date}>
            {formattedLateFeeTime}
          </span>
        </td>
      );
    }
    if (dateCell) {
      bundleRows.push(
        <tr className={`${classes.Regular}`} key={`${bundleIndex}-regular`}>
          <td>
            ${bundleRegularPrice}
          </td>
          {dateCell}
        </tr>
      );
    }

    // Late-fee row
    if (bundleLateFee) {
      bundleRows.push(
        <tr className={`${classes.Late}`} key={`${bundleIndex}-late`}>
          <td>
            ${bundleRegularPrice + bundleLateFee}
          </td>
          <td>
            After{' '}
            <span className={classes.Date}>
                    {formattedLateFeeTime}
                  </span>
          </td>
        </tr>
      );
    }

    return {
      name: name,
      regularPrice: bundleRegularPrice,
      rows: bundleRows,
    }
  });
  // End of building rows for bundle discounts

  return (
    <div className={classes.Details}>
      <h6>
        Entry Fees
      </h6>
      {priceBreakdown.map(({event, rows}) => (
        <div className={'table-responsive'} key={event.identifier}>
          <table className={`table table-borderless ${classes.FeeTable}`}>
            <thead>
            <tr>
              <th colSpan={2}>
                {event.name}
              </th>
            </tr>
            </thead>
            {rows.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={2}>
                    Entry fee: ${event.value}
                  </td>
                </tr>
              </tbody>
            )}
            {rows.length > 0 && (
              <tbody>
                {rows}
              </tbody>
            )}
          </table>
        </div>
      ))}
      {bundleBreakdowns.map(({name, rows, regularPrice}, index) => (
        <div className={'table-responsive'} key={`bundle-breakdown-${index}`}>
          <table className={`table table-borderless ${classes.FeeTable}`}>
            <thead>
            <tr>
              <th colSpan={2}>
                {name}
              </th>
            </tr>
            </thead>
            {rows.length === 0 && (
              <tbody>
              <tr>
                <td colSpan={2}>
                  Bundle entry fee: ${regularPrice}
                </td>
              </tr>
              </tbody>
            )}
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
