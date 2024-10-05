const MultipleShifts = ({shifts, unit}) => {
  // Display only capacity; hide name and details
  return (
    <div>
      <h3>
        Shifts
      </h3>
      {shifts.map(shift => (
        <>
          <p className={'float-end'}>
            <a href={'#'}
               onClick={() => {
               }}
               className={"col-1 text-end"}
               title={'Edit'}>
              <i className="bi bi-pencil-fill" aria-hidden={true}></i>
              <span className={'visually-hidden'}>
                  Edit
                </span>
            </a>
          </p>

          <p>
            {shift.name}&nbsp;
            ({shift.description})
          </p>

          <p>
            Capacity: {shift.capacity} {unit}
          </p>

          <div className="row pb-3">
            <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
            <span className={"col ms-3"}>
              Marked as full
            </span>
          </div>
        </>
      ))}
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
