import {ProgressBar} from "react-bootstrap";
import classes from './ShiftCapacity.module.scss';

const ShiftCapacity = ({shift, includeName}) => {
  if (!shift) {
    return '';
  }

  const percent = (num, outOf) => {
    return Math.round(num / outOf * 100);
  }

  const unpaidCount = Math.min(shift.unpaid_count, shift.capacity - shift.paid_count);

  return (
    <div className={`${classes.ProgressBar} d-flex align-items-center my-2`}>
      {includeName && <h6 className={'fw-light pe-2'}>{shift.name}</h6> }
      <div className={'flex-grow-1'}>
        <div className={`d-flex justify-content-between`}>
          <div className={classes.EndLabel}>0%</div>
          <div className={classes.EndLabel}>100%</div>
        </div>
        <div>
          {/* TODO: migrate this markup so that role and aria-* attributes are properly announced. */}
          {/* The hope is that ReactBootstrap will build that in so we don't have to. */}
          <ProgressBar style={{height: '2rem'}}>
            <ProgressBar now={percent(shift.paid_count, shift.capacity)}
                         label={`${percent(shift.paid_count, shift.capacity)}%`}
                         variant={'success'}/>
            <ProgressBar now={percent(unpaidCount, shift.capacity)}
                         label={`${percent(unpaidCount, shift.capacity)}%`}
                         variant={'primary'}/>
          </ProgressBar>
        </div>
      </div>
    </div>
  );
}

export default ShiftCapacity;
