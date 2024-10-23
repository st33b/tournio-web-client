import Capacity from "./Charts/Capacity";
import classes from './ActiveTournament.module.scss';

const OneShift = ({shift, unit}) => {
  // Display only capacity; hide name and details
  return (
    <div className={classes.OneShift}>
      <div className={'card mb-3'}>
        <div className={'card-header'}>
          <h5 className={'fw-light'}>
            Capacity
          </h5>
        </div>

        <Capacity shifts={[shift]}/>

        <div className='card-body d-flex align-items-start'>
          <span className="d-block">
            Max {unit}:
          </span>
          <span className={"d-block px-2 h4"}>
            {shift.capacity}
          </span>

          <span className={"d-block ms-auto"}>
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
