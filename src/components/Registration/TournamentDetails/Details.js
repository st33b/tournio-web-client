import classes from './TournamentDetails.module.scss';
import {formatInTimeZone} from 'date-fns-tz';
import {Col, Row} from "react-bootstrap";

const Details = ({tournament}) => {
  // early_registration_discount
  // early_registration_ends

  // registration fee

  // late_fee_applies_at
  // late_registration_fee

  // entry_deadline

  if (!tournament) {
    return '';
  }

  const start = new Date(tournament.start_date);
  const end = new Date(tournament.end_date);

  const earlyRegEnds = tournament.early_registration_ends;
  const lateRegStarts = tournament.late_fee_applies_at;
  const noFeeChanges = !earlyRegEnds && !lateRegStarts;

  const formattedDeadline = formatInTimeZone(new Date(tournament.entry_deadline), tournament.timezone,'PP p z');

  return (
    <div className={classes.Details}>
      <dl>
        {noFeeChanges && (
          <Row>
            <Col xs={4}>
              <dt>Entry Fee</dt>
            </Col>
            <Col>
              <dd>${tournament.registration_fee}</dd>
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={4}>
            <dt>Registration Deadline</dt>
          </Col>
          <Col>
            <dd>{formattedDeadline}</dd>
          </Col>
        </Row>
      </dl>
      {!noFeeChanges && (
        <div className={'table-responsive'}>
          <table className={'table table-borderless'}>
            <thead>
            <tr>
              <th colSpan={2}>
                Registration Fee
              </th>
            </tr>
            </thead>
            <tbody>
            {earlyRegEnds && (
              <tr className={`${classes.Early} table-success`}>
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
              <tr className={`${classes.Late} table-warning`}>
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

export default Details;
