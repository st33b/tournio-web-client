import classes from './ShiftCapacity.module.scss';
import ErrorBoundary from "../ErrorBoundary";

const ShiftCapacity = ({shift, includeName}) => {
  if (!shift) {
    return '';
  }

  const percent = (num, outOf) => {
    return Math.round(num / outOf * 100);
  }

  return (
    <ErrorBoundary>

      <div className={`${classes.ShiftCapacity} d-flex align-items-center my-2`}>
        {includeName && <h6 className={'fw-light pe-2'}>{shift.name}</h6>}
        <div className={'flex-grow-1'}>
          <div className={`d-flex justify-content-between`}>
            <div className={classes.EndLabel}>0%</div>
            <div className={classes.EndLabel}>100%</div>
          </div>
          <div>
            <div className={`progress-stacked ${classes.BarStack}`}
                 aria-label={"Shift capacity indicator"}>
              <div className={`progress ${classes.Segment}`}
                   role={`progressbar`}
                   aria-label={`Requested segment`}
                   aria-valuenow={percent(shift.requested, shift.capacity)}
                   style={{width: `${percent(shift.requested, shift.capacity)}%`}}
                   aria-valuemin={0}
                   aria-valuemax={100}>
                <div className={`progress-bar ${classes.Requested}`}>
                  {percent(shift.requested, shift.capacity)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>

  );
}

export default ShiftCapacity;
