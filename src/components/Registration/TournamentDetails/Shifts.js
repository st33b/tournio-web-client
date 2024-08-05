import classes from './TournamentDetails.module.scss';
import ShiftCapacity from "../../common/ShiftCapacity/ShiftCapacity";
import ProgressBarLegend from "../../common/ShiftCapacity/ProgressBarLegend";

const Shifts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  let capacityNoun = 'teams';
  if (!tournament.events.some(({rosterType}) => rosterType === 'team')) {
    capacityNoun = 'bowlers';
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
                  <h5 className={shift.isFull ? classes.Full : ''}>
                    {shift.isFull && (
                        <span className={classes.Indicator}>
                        [FULL]&nbsp;
                      </span>
                    )}
                    <span className={classes.Name}>
                      {shift.name}
                    </span>
                  </h5>
                  {!!shift.description && (
                    <p className={`fw-light ${!displayCapacity ? 'mb-0' : ''}`}>
                        {shift.description}
                      </p>
                  )}
                  {displayCapacity && (
                    <p className={`fw-light mb-0`}>
                      This shift has a maximum capacity of {shift.capacity} {capacityNoun}.
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
                The tournament has a maximum capacity of {shift.capacity} {capacityNoun}.
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
