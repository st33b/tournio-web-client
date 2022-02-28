import classes from './SingleUseItem.module.scss';

const singleUseItem = ({item, removed}) => {
  const removeClickedHandler = (event) => {
    event.preventDefault();
    removed(item);
  }

  const removeLink = (
    <div className={'ms-auto align-self-center'}>
      <a href={'#'}
         onClick={removeClickedHandler}
         className={`${classes.RemoveLink} pe-3 text-danger text-opacity-75`}>
        <i className={'bi-x-circle-fill'} />
        <span className={'visually-hidden'}>Remove</span>
      </a>
    </div>
  );

  let note = '';
  if (item.configuration.division) {
    note = (
      <p className={classes.Note}>
        Division: {item.configuration.division}
      </p>
    );
  }

  return (
    <div className={`${classes.SingleUseItem} rounded border border-secondary mb-3 mx-0 d-flex`}>
      <div className={'ps-2'}>
        <p>
          {item.name}
        </p>
        <p>
          ${item.value}
        </p>
      </div>
      {removeLink}
    </div>
  );
}

export default singleUseItem;