import {useEffect, useState} from "react";
import {format, parseISO} from 'date-fns';
import Cookies from 'js-cookie';

import classes from './MaintenanceAnnouncement.module.scss';

const MaintenanceAnnouncement = () => {
  const COOKIE_NAME = 'tournio-maintenance-dismissed';
  const [showMaint, setShowMaint] = useState(false);
  useEffect(() => {
    setShowMaint(Cookies.get(COOKIE_NAME) !== '1');
  }, [])

  const envTime = process.env.NEXT_PUBLIC_MAINTENANCE_START;
  if (!envTime) {
    return '';
  }

  const dismissed = () => {
    Cookies.set(COOKIE_NAME, '1', { expires: 7, sameSite: 'strict'});
  }

  const parsedTime = parseISO(envTime);

  const theDate = format(parsedTime, 'cccc, MMMM do'); // Day of week + date
  const startTime = format(parsedTime, 'h:mmaaa'); // time of day
  const ending = parsedTime.setHours(parsedTime.getHours() + 2);
  const endTime = format(ending, 'h:mmaaa'); // two hours, time of day

  return (
    <div className={classes.MaintenanceAnnouncement}>
      {showMaint &&
        <div className={`alert alert-warning alert-dismissible fade show d-flex align-items-center my-3`} role={'alert'}>
          <i className={'bi-exclamation-circle pe-2'} aria-hidden={true} />
          <div className={'me-auto'}>
            On{' '}
            <span className={classes.TimeBoundary}>
              {theDate}
            </span>
            , Tournio will be offline for planned maintenance from{' '}
            <span className={classes.TimeBoundary}>
              {startTime}
            </span>
            {' to '}
            <span className={classes.TimeBoundary}>
              {endTime}
            </span>
            .
          </div>
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={dismissed}
                  aria-label="Close"/>
        </div>
      }
    </div>
  );
}

export default MaintenanceAnnouncement;
