import {format, formatISO} from "date-fns";

import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './VisibleTournament.module.scss';

const ConfigItem = ({item}) => {
  if (!item) {
    return '';
  }

    let displayedValue = '';
    switch (item.key) {
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