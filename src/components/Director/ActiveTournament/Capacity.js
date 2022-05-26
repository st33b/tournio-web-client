import {Placeholder} from "react-bootstrap";
import ShiftCapacity from "../../common/ShiftCapacity/ShiftCapacity";
import ProgressBarLegend from "../../common/ShiftCapacity/ProgressBarLegend";

import classes from './ActiveTournament.module.scss';

const Capacity = ({tournament}) => {
  let content = (
    <Placeholder animation={'glow'}>
      <Placeholder xs={4} bg={'primary'} />{' '}
      <Placeholder xs={6} bg={'success'}/>
    </Placeholder>
  );
  if (tournament) {
    const includeName = tournament.shifts.length > 1;
    content = tournament.shifts.map((shift, i) => {
      return (
        <ShiftCapacity shift={shift} includeName={includeName} key={i}/>
      );
    })
  }
  return (
    <div className={`${classes.Capacity} border rounded-sm p-2 p-sm-3 mb-3`}>
      <div>
        <h5 className={'fw-light'}>
          Capacity
        </h5>

        {content}
      </div>
      <ProgressBarLegend/>
    </div>
  );
}

export default Capacity;