import classes from './AddBowler.module.scss';
import Link from "next/link";
import {devConsoleLog} from "../../../utils";

const AddBowler = ({tournament, team, position}) => {
  devConsoleLog("------------ component untouched in team restoration");

  return (
    <div className={classes.AddBowler}>
      <Link className={''}
         href={{
           pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/add-bowler',
           query: {
             identifier: tournament.identifier,
             teamIdentifier: team.identifier,
             position: position,
           }
         }}
      >
        Add Bowler
      </Link>
    </div>
  );
}

export default AddBowler;
