import classes from './PositionUnavailable.module.scss';

const PositionUnavailable = () => {

  return (
    <div className={classes.PositionUnavailable}>
      <p className={`${classes.Message} text-danger`}>
        Position Unavailable
      </p>
    </div>
  );
}

export default PositionUnavailable;
