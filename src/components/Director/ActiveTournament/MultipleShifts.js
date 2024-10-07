import classes from './ActiveTournament.module.scss';
import OneOfManyShifts from "./OneOfManyShifts";

// @admin
// TODO: handle Full toggling
// TODO: handle shift add/edit
const MultipleShifts = ({shifts, unit}) => {
  // Display only capacity; hide name and details
  return (
    <div className={classes.MultipleShifts}>
      <div className="card mb-3">
        <h4 className={'card-header'}>
          Shifts
        </h4>
        <ul className={'list-group list-group-flush'}>
          {shifts.map(shift => (
            <li className={'list-group-item'}
                key={`${shift.identifier}--key`}>
              <OneOfManyShifts shift={shift}
                               unit={unit}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <button type={'button'}
                className={'btn btn-outline-primary'}
                role={'button'}
                onClick={() => {}}>
          <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
          Add new shift
        </button>
      </div>
    </div>
  );
};

export default MultipleShifts;
