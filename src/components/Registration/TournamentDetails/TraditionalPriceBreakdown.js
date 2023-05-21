import {formatInTimeZone} from 'date-fns-tz';

import classes from './TournamentDetails.module.scss';

const TraditionalPriceBreakdown = ({tournament}) => {
  if (!tournament || !tournament.registration_fee) {
    return '';
  }

  const earlyRegEnds = tournament.early_registration_ends;
  const lateRegStarts = tournament.late_fee_applies_at;
  const noFeeChanges = !earlyRegEnds && !lateRegStarts;

  return (
    <div className={classes.Details}>
      {noFeeChanges && (
        <p>
          <strong>
            Entry Fee:{' '}
          </strong>
          ${tournament.registration_fee}
        </p>
      )}
      {!noFeeChanges && (
        <div className={'table-responsive'}>
          <table className={`table table-borderless ${classes.FeeTable}`}>
            <thead>
            <tr>
              <th colSpan={2}>
                Entry Fee
              </th>
            </tr>
            </thead>
            <tbody>
            {earlyRegEnds && (
              <tr className={`${classes.Early}`}>
                <td>
                  ${tournament.registration_fee - tournament.early_registration_discount}
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
                ${tournament.registration_fee}
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
                  ${tournament.registration_fee + tournament.late_registration_fee}
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
      )}
    </div>
  )
}

export default TraditionalPriceBreakdown;
