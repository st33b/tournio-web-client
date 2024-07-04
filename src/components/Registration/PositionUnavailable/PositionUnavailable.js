import classes from './PositionUnavailable.module.scss';
import {devConsoleLog} from "../../../utils";

const PositionUnavailable = () => {
  devConsoleLog("------------ component untouched in team restoration");

  return (
    <div className={classes.PositionUnavailable}>
      <p className={`${classes.Message} text-danger`}>
        Position Unavailable
      </p>
    </div>
  );
}

export default PositionUnavailable;
