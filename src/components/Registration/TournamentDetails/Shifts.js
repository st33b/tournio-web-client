import classes from './TournamentDetails.module.scss';
import ShiftCapacity from "../../common/ShiftCapacity/ShiftCapacity";
import ProgressBarLegend from "../../common/ShiftCapacity/ProgressBarLegend";

const Shifts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  let shiftContent = '';
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
                  <h5>
                    {shift.name}
                  </h5>
                  {!!shift.description && (
                    <p className={'fw-light'}>
                        {shift.description}
                      </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  return shiftContent;
}

export default Shifts;
