import classes from './TournamentDetails.module.scss';
import ShiftCapacity from "../../common/ShiftCapacity/ShiftCapacity";
import ProgressBarLegend from "../../common/ShiftCapacity/ProgressBarLegend";

const Shifts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  let shiftContent = '';
  const displayCapacity = tournament.display_capacity;
  if (tournament.shifts.length > 1) {
    shiftContent = (
      <div className={`${classes.Shifts}`} data-bs-theme={'dark'}>
        <h4 className={'fw-light'}>
          Shifts
        </h4>
        {tournament.shifts.map((shift, i) => {
          return (
            <div key={i} className={`${classes.ShiftInfo} border rounded-2`}>
              <div className={'row'}>
                <div className={'col'}>
                  <h5>
                    {shift.name}
                    {!!shift.description && (
                      <span className={'fw-light'}>
                        {' '}&ndash;{' '}{shift.description}
                      </span>
                      )}
                  </h5>
                  <p className={'mb-0'}>
                    Capacity: {shift.capacity} bowlers / {shift.capacity / 4} teams
                  </p>
                </div>
              </div>

              {displayCapacity && <ShiftCapacity shift={shift} key={i}/>}
            </div>
          )
        })}

        {displayCapacity && <ProgressBarLegend/>}
        <div className={classes.ConfirmedNote}>
          * A bowler&apos;s place in a shift cannot be confirmed until they have paid their registration fees.
        </div>
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
              The tournament can accommodate up to {shift.capacity} bowlers / {shift.capacity / 4} teams.
            </p>

            <ShiftCapacity shift={shift}/>
          </div>
          <ProgressBarLegend/>
          <div className={classes.ConfirmedNote}>
            * A bowler&apos;s place in a shift cannot be confirmed until they have paid their registration fees.
          </div>
        </div>
      </div>
    );
  }

  return shiftContent;
}

export default Shifts;
