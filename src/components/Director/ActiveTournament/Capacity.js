import ShiftCapacity from "../../common/ShiftCapacity/ShiftCapacity";

import classes from '../ActiveTournament/ActiveTournament.module.scss';

const Capacity = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const includeName = tournament.shifts.length > 1;
  return (
    <div className={`${classes.Capacity} border rounded-sm p-2 p-sm-3 mb-3`}>
      <div>
        <h5 className={'fw-light'}>
          Capacity
        </h5>

        {tournament.shifts.map((shift, i) => {
          return (
            <ShiftCapacity shift={shift} includeName={includeName} key={i}/>
          );
        })}
      </div>
    </div>
  );
}

export default Capacity;
