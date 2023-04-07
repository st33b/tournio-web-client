import classes from './MultiUseItem.module.scss';

const multiUseItem = ({item, increase, decrease}) => {
  if (!item) {
    return '';
  }

  const decreaseClickedHandler = (event) => {
    event.preventDefault();
    decrease(item);
  }

  const increaseClickedHandler = (event) => {
    event.preventDefault();
    increase(item);
  }

  let links = (
    <div className={'ms-auto align-self-center pe-3'}>
      <a href={'#'}
         onClick={decreaseClickedHandler}
         className={`${classes.DecreaseLink} mx-1 text-primary text-opacity-75`}>
        <i className={'bi-dash-square-fill'} />
        <span className={'visually-hidden'}>Decrease</span>
      </a>
      <a href={'#'}
         onClick={increaseClickedHandler}
         className={`${classes.IncreaseLink} mx-1 text-primary text-opacity-75`}>
        <i className={'bi-plus-square-fill'} />
        <span className={'visually-hidden'}>Increase</span>
      </a>
    </div>
  );

  let {name, note, value, displaySize, quantity} = item;

  return (
    <div className={`${classes.MultiUseItem} rounded border mb-3 mx-0 d-flex`}>
      <div className={'ps-2'}>
        <p>
          {name}
        </p>
        {/*{note && (*/}
        {/*  <p className={classes.Note}>*/}
        {/*    {note}*/}
        {/*  </p>*/}
        {/*)}*/}
        {displaySize && (
          <p className={classes.Size}>
            {displaySize}
          </p>
        )}
        <p>
          ${value} &times; {quantity}
        </p>
      </div>
      {links}
    </div>
  );
}

export default multiUseItem;
