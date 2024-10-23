import ShiftCapacity from "../../../common/ShiftCapacity/ShiftCapacity";

import classes from '../ActiveTournament.module.scss';

const Capacity = ({shifts}) => {
  if (!shifts) {
    return '';
  }

  const includeName = shifts.length > 1;
  return (
    <div className={classes.Capacity}>
      <div className={'card border-0'}>
        <div className={'card-body'}>
          {shifts.map((shift, i) => {
            return (
              <ShiftCapacity shift={shift} includeName={includeName} key={i}/>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Capacity;
