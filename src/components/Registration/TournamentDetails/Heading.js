import {format} from "date-fns";
import classes from './TournamentDetails.module.scss';
import {formatInTimeZone} from "date-fns-tz";

const Heading = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  /*
   * @hack To get dates to seem like they're behaving. But they're actually not.
   * @todo Use a JS library for date/time handling that can properly distinguish dates from timestamps
   */
  const start = new Date(`${tournament.start_date}T12:00:00-04:00`);
  const end = new Date(`${tournament.end_date}T12:00:00-04:00`);
  const startMonth = format(start, 'LLLL');
  const endMonth = format(end, 'LLLL');
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  const startDisplayYear = startYear === endYear ? '' : `, ${startYear}`;
  const endDisplayYear = endYear;
  let datesString = '';
  if (startMonth === endMonth) {
    datesString = `${startMonth} ${start.getDate()}${startDisplayYear}-${end.getDate()}, ${endDisplayYear}`;
  } else {
    datesString = `${startMonth} ${start.getDate()}${startDisplayYear}-${endMonth} ${end.getDate()}, ${endDisplayYear}`;
  }
  const formattedDeadline = formatInTimeZone(new Date(tournament.entry_deadline), tournament.timezone,'PP p z');


  return (
    <div>
      <h2 className={'mb-3'}>
        {tournament.name}
      </h2>
      <h4 className={'fst-italic'}>
        {datesString}
      </h4>

      {tournament.website && (
        <p className={`mb-0 ${classes.WebsiteLink}`}>
          <a href={tournament.website}>
            tournament website
            <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden="true"/>
          </a>
        </p>
      )}

      <p className={'my-3'}>
        <strong>
          Entry Deadline:{' '}
        </strong>
        {formattedDeadline}
      </p>
    </div>
  );
}

export default Heading;
