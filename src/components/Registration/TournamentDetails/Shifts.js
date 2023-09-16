import classes from './TournamentDetails.module.scss';

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
