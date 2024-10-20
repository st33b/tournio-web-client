import classes from './ActiveTournament.module.scss';

const OneShift = ({shift, unit}) => {
  // Display only capacity; hide name and details
  return (
    <div className={classes.OneShift}>
      <div className="d-flex align-items-start">
        <span className="d-block">
          Capacity:
        </span>
        <span className={"d-block px-2 h4"}>
          {shift.capacity}
        </span>
        <span className={"d-block"}>
          {unit}
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

      <div className="text-center mt-3">
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

export default OneShift;
