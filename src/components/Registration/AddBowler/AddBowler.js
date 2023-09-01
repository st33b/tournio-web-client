import classes from './AddBowler.module.scss';
import Link from "next/link";

const AddBowler = ({tournament, team}) => {

  return (
    <div className={classes.AddBowler}>
      <Link className={'btn btn-lg btn-primary'}
         href={{
           pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/add-bowler',
           query: {
             identifier: tournament.identifier,
             teamIdentifier: team.identifier,
           }
         }}
      >
        Add Bowler Details
      </Link>
    </div>
  );
}

export default AddBowler;
