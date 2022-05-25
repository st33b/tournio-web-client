import {ProgressBar} from "react-bootstrap";
import classes from './ShiftCapacity.module.scss';

const ShiftCapacity = ({shift, includeName}) => {
  if (!shift) {
    return '';
  }

  const percent = (num, outOf) => {
    return Math.round(num / outOf * 100);
  }

  const requestedCount = Math.min(shift.requested_count, shift.capacity - shift.confirmed_count);

  return (
    <div className={`${classes.ProgressBar} d-flex align-items-center my-2`}>
      {includeName && <h6 className={'fw-light'}>{shift.name}</h6> }
      <div className={'flex-grow-1'}>
        <div className={`d-flex justify-content-between`}>
          <div className={classes.EndLabel}>0%</div>
          <div className={classes.EndLabel}>100%</div>
        </div>
        <div>
          <ProgressBar style={{height: '2rem'}}>
            <ProgressBar now={percent(shift.confirmed_count, shift.capacity)}
                         label={`${percent(shift.confirmed_count, shift.capacity)}%`}
                         variant={'success'}/>
            <ProgressBar now={percent(requestedCount, shift.capacity)}
                         label={`${percent(requestedCount, shift.capacity)}%`}
                         variant={'primary'}/>
          </ProgressBar>
        </div>
      </div>
    </div>
  );
}

export default ShiftCapacity;