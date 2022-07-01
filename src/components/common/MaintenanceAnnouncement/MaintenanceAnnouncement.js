import {format, parseISO} from 'date-fns';

import classes from './MaintenanceAnnouncement.module.scss';

const MaintenanceAnnouncement = () => {
  const envTime = process.env.NEXT_PUBLIC_MAINTENANCE_START;

  if (!envTime) {
    return '';
  }

  const parsedTime = parseISO(envTime);

  const theDate = format(parsedTime, 'cccc, MMMM do'); // Day of week + date
  const startTime = format(parsedTime, 'h:mmaaa'); // time of day
  const ending = parsedTime.setHours(parsedTime.getHours() + 2);
  const endTime = format(ending, 'h:mmaaa'); // two hours, time of day

  return (
    <div className={`${classes.MaintenanceAnnouncement} alert alert-warning fade show d-flex align-items-center my-3`} role={'alert'}>
      <i className={'bi-exclamation-circle pe-2'} aria-hidden={true} />
      <div>
        On{' '}
        <span className={classes.TimeBoundary}>
          {theDate}
        </span>
        , the registration system will be offline for planned maintenance from{' '}
        <span className={classes.TimeBoundary}>
          {startTime}
        </span>
        {' to '}
        <span className={classes.TimeBoundary}>
          {endTime}
        </span>
        .
      </div>
    </div>
  );
}

export default MaintenanceAnnouncement;