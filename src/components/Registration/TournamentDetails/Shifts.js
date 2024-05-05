import classes from './TournamentDetails.module.scss';
import ShiftCapacity from "../../common/ShiftCapacity/ShiftCapacity";
import ProgressBarLegend from "../../common/ShiftCapacity/ProgressBarLegend";

const Shifts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  let shiftContent = '';
  const displayCapacity = tournament.config['display_capacity'];
  if (tournament.shifts.length > 1) {
    shiftContent = (
      <div className={`${classes.Shifts}`}>
        <h4 className={'fw-light'}>
          Shifts
        </h4>
        {tournament.shifts.map((shift, i) => {
          return (
            <div key={i} className={`${classes.ShiftInfo} border rounded-2`}>
              <div className={'row'}>
                <div className={'col'}>
                  <h5 className={shift.is_full ? classes.Full : ''}>
                    {shift.is_full && (
                        <span className={classes.Indicator}>
                        [FULL]&nbsp;
                      </span>
                    )}
                    <span className={classes.Name}>
                      {shift.name}
                    </span>
                  </h5>
                  {!!shift.description && (
                    <p className={'fw-light mb-0'}>
                        {shift.description}
                      </p>
                  )}
                </div>
              </div>
              {displayCapacity && <ShiftCapacity shift={shift} key={i} />}
            </div>
          )
        })}
        {displayCapacity && <ProgressBarLegend/>}
      </div>
    );
  } else if (tournament.shifts.length === 1 && displayCapacity) {
    const shift = tournament.shifts[0];
    shiftContent = (
        <div className={classes.Shifts}>
          <h4 className={'fw-light'}>
            Capacity
          </h4>
          <div className={`${classes.ShiftInfo} border rounded-2`}>
            <div>
              <p>
                The tournament can accommodate up to {shift.capacity} teams.
              </p>

              <ShiftCapacity shift={shift}/>
            </div>
            <ProgressBarLegend/>
          </div>
        </div>
    );
  }

  return shiftContent;
}

export default Shifts;
