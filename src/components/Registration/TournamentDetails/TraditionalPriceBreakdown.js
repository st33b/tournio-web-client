import {format} from "date-fns";
import classes from './TournamentDetails.module.scss';

const TraditionalPriceBreakdown = ({tournament}) => {
  if (!tournament || !tournament.feesAndDiscounts) {
    return '';
  }

  const entryFee = tournament.feesAndDiscounts.find(({determination}) => determination === 'entry_fee');
  const earlyDiscount = tournament.feesAndDiscounts.find(({determination}) => determination === 'early_discount');
  const earlyRegEnds = earlyDiscount ? format(Date.parse(earlyDiscount.configuration.valid_until), 'PPp') : false;

  const lateFee = tournament.feesAndDiscounts.find(({determination}) => determination === 'late_fee');
  let lateRegStarts = lateFee ? format(Date.parse(lateFee.configuration.applies_at), 'PPp') : false;

  const noFeeChanges = !earlyRegEnds && !lateRegStarts;

  return (
    <div className={classes.Details}>
      {noFeeChanges && (
        <p>
          <strong>
            Entry Fee:{' '}
          </strong>
          ${entryFee.value}
        </p>
      )}
      {!noFeeChanges && (
        <>
          <h5>
            Entry Fee
          </h5>
          <div className={'table-responsive'}>
            <table className={`table table-borderless ${classes.FeeTable}`}>
              <tbody>
              {earlyRegEnds && (
                <tr className={`${classes.Early}`}>
                  <td>
                    ${entryFee.value - earlyDiscount.value}
                  </td>
                  <td>
                    Until{' '}
                    <span className={classes.Date}>
                    {earlyRegEnds}
                  </span>
                  </td>
                </tr>
              )}
              <tr className={`${classes.Regular}`}>
                <td>
                  ${entryFee.value}
                </td>
                {earlyRegEnds && lateRegStarts && (
                  <td>
                    Between{' '}
                    <span className={classes.Date}>
                    {earlyRegEnds}
                    </span>
                    {' '}and{' '}
                    <span className={classes.Date}>
                    {lateRegStarts}
                  </span>
                  </td>
                )}
                {!earlyRegEnds && lateRegStarts && (
                  <td>
                    Until{' '}
                    <span className={classes.Date}>
                    {lateRegStarts}
                  </span>
                  </td>
                )}
                {earlyRegEnds && !lateRegStarts && (
                  <td>
                    After{' '}
                    <span className={classes.Date}>
                    {earlyRegEnds}
                  </span>
                  </td>
                )}
              </tr>
              {lateRegStarts && (
                <tr className={`${classes.Late}`}>
                  <td>
                    ${entryFee.value + lateFee.value}
                  </td>
                  <td>
                    After{' '}
                    <span className={classes.Date}>
                    {lateRegStarts}
                  </span>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default TraditionalPriceBreakdown;
