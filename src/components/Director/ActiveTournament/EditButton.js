// Presents an edit button, styled as a pencil, and end-floated by default.
// To position differently, use the classNames prop.
const EditButton = ({onClick, ...props}) => {
  const clickHandler = (e) => {
    e.preventDefault();
    onClick();
  };

  const classNames = props.className ? props.className : 'float-end ps-2';

  return (
    <span className={`d-block ${classNames}`}>
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
