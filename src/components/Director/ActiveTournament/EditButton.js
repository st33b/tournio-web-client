// Presents an end-floated edit button, styled as a pencil.
const EditButton = ({onClick}) => {
  const clickHandler = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <span className={'d-block float-end ps-2'}>
      <a href={'#'}
         onClick={clickHandler}
         className={``}
         title={'Edit'}>
        <i className="bi bi-pencil-fill" aria-hidden={true}></i>
        <span className={'visually-hidden'}>
          Edit
        </span>
      </a>
    </span>
  );
}

export default EditButton;
