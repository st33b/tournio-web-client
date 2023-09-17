import classes from './RegisteredBowler.module.scss';
import PayButton from "../TournamentDetails/PayButton";

const RegisteredBowler = ({bowler}) => {

  return (
    <div className={classes.RegisteredBowler}>
      <p className={classes.Name}>
        {bowler.full_name}
      </p>
      {/* TODO: get the disabled property set */}
      <PayButton bowler={bowler} disabled={false}/>
    </div>
  );
}

export default RegisteredBowler;
