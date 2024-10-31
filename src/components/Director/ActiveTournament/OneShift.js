import Capacity from "./Charts/Capacity";
import classes from './ActiveTournament.module.scss';
import CardHeader from "./CardHeader";
import EditButton from "./EditButton";

const OneShift = ({shift, unit}) => {
  // Display only capacity; hide name and details
  return (
    <div className={classes.OneShift}>
      <div className={'card mb-3'}>
        <CardHeader headerText={'Capacity'}/>

        <Capacity shifts={[shift]}/>

        <div className='card-body d-flex align-items-start'>
          <span className="d-block">
            Max {unit}:
          </span>
          <span className={"d-block px-2 h4"}>
            {shift.capacity}
          </span>

          <EditButton onClick={() => {}} className={'d-block ms-auto'}/>
        </div>

        <div className="card-body text-center">
          <button type={'button'}
                  className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={() => {}}>
            <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
            Add new shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default OneShift;
