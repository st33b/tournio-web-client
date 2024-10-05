const OneShift = ({unit}) => {
  // Display only capacity; hide name and details
  return (
    <div>
      <h3>
        Capacity
      </h3>
      <div className="row">
        <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
        <span className={"col ms-3"}>
          {unit}
        </span>
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

export default OneShift;
