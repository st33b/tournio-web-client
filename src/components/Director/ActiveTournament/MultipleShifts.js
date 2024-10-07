import classes from './ActiveTournament.module.scss';
import Toggle from "./Toggle";

// @admin
// TODO: handle Full toggling
// TODO: handle shift add/edit
const MultipleShifts = ({shifts, unit}) => {
  // Display only capacity; hide name and details
  return (
    <div className={classes.MultipleShifts}>
      <div className="card mb-3">
        <h3 className={'card-header'}>
          Shifts
        </h3>
        {shifts.map(shift => (
          <ul className={'list-group list-group-flush'}>
            <li className={'list-group-item'}>
              <span className={'d-block float-end ps-2'}>
                <a href={'#'}
                   onClick={() => {}}
                   className={""}
                   title={'Edit'}>
                  <i className="bi bi-pencil-fill" aria-hidden={true}></i>
                  <span className={'visually-hidden'}>
                    Edit
                  </span>
                </a>
              </span>

              <p className={classes.ShiftDetail}>
                Name:
                <strong className={'ps-2'}>
                  {shift.name}
                </strong>
              </p>

              <p className={classes.ShiftDetail}>
                Description:
                <strong className={'ps-2'}>
                  {shift.description}
                </strong>
              </p>

              {/* mix-and-match shifts: list the shift's events */}

              <p className={classes.ShiftDetail}>
                Capacity:
                <span className={'h4 px-2'}>
                  {shift.capacity}
                </span>
                <strong>
                  {unit}
                </strong>
              </p>

              <p className={classes.ShiftDetail}>
                <Toggle label={'Full'}
                        name={`${shift.identifier}--toggle_full`}
                        htmlId={`${shift.identifier}--toggle_full`}
                        checked={shift.isFull}
                        onChange={() => {}}/>
              </p>
            </li>
          </ul>
        ))}
      </div>
      <div className="text-center">
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
  );
};

export default MultipleShifts;
