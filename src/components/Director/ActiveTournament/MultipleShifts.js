import OneOfManyShifts from "./OneOfManyShifts";
import CardHeader from "./CardHeader";
import classes from './ActiveTournament.module.scss';

// @admin
// TODO: handle Full toggling
// TODO: handle shift add/edit
const MultipleShifts = ({shifts, unit}) => {
  // Display only capacity; hide name and details
  return (
    <div className={classes.MultipleShifts}>
      <div className="card mb-3">
        <CardHeader headerText={'Shifts'}
                    titleText={''}
                    id={'shifts--tooltip'}/>

        <ul className={'list-group list-group-flush'}>
          {shifts.map(shift => (
            <li className={'list-group-item'}
                key={`${shift.identifier}--key`}>
              {/*<ShiftCapacity shift={shift} includeName={false}/>*/}
              <OneOfManyShifts shift={shift}
                               unit={unit}
              />
            </li>
          ))}
        </ul>

        <div className="text-center my-3">
          <button type={'button'}
                  className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={() => {
                  }}>
            <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
            Add new shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleShifts;
