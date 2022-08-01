import {format, formatISO} from "date-fns";
import {Accordion, Placeholder} from "react-bootstrap";

import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './ActiveTournament.module.scss';

const ConfigItem = ({item}) => {
  if (!item) {
    return '';
  }

  const timeZones = {
    'Pacific/Honolulu': {
      key: 'Pacific/Honolulu',
      display: 'Hawaii (HST)',
    },
    'America/Adak': {
      key: 'America/Adak',
      display: 'Hawaii-Aleutian (HST/HDT)',
    },
    'America/Anchorage': {
      key: 'America/Anchorage',
      display: 'Alaska (AKST/AKDT)',
    },
    'America/Los_Angeles': {
      key: 'America/Los_Angeles',
      display: 'Pacific (PST/PDT)',
    },
    'America/Phoenix': {
      key: 'America/Phoenix',
      display: 'Phoenix (MST)',
    },
    'America/Denver': {
      key: 'America/Denver',
      display: 'Mountain (MST/MDT)',
    },
    'America/Chicago': {
      key: 'America/Chicago',
      display: 'Central (CST/CDT)',
    },
    'America/New_York': {
      key: 'America/New_York',
      display: 'Eastern (EST/EDT)',
    },
  }

    let displayedValue = '';
    switch (item.key) {
      case 'time_zone':
        displayedValue = timeZones[item.value].display;
        break;
      case 'website':
        displayedValue = (
          <a href={item.value}
             title={item.value}
             target={'_new'}>
            visit
            <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden={true} />
          </a>
        );
        break;
      case 'entry_deadline':
        displayedValue = format(new Date(item.value), 'PPp');
        break;
      default:
        displayedValue = item.value;
        break;
    }

  return (
    <ErrorBoundary>
      <div className={classes.ConfigItem}>
        <div className={`${classes.Item} d-flex`} key={item.key}>
          <dt className={'col-4'}>{item.label}</dt>
          <dd className={'ps-2 flex-grow-1 overflow-hidden'}>{displayedValue}</dd>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ConfigItem;