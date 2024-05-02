import classes from "./NewTeamReview.module.scss";
import BowlerSummary from "../ReviewEntries/BowlerSummary";

const NewTeamReview = ({team, bowler, tournament}) => {
  if (!tournament) {
    return '';
  }

  const shiftIdentifiers = team.shiftIdentifiers || [];
  const chosenShifts = tournament.shifts.length === 1
    ? ''
    : tournament.shifts.filter(({identifier}) => shiftIdentifiers.includes(identifier));

  if (!team || !bowler) {
    return '';
  }

  return (
    <div className={classes.NewTeamReview}>
      <h2 className={``}>
        Team:&nbsp;
        <strong>
          {team.name}
        </strong>
      </h2>

      <hr />

      <h3 className={``}>
        First Bowler - Review
      </h3>

      <dl className={classes.TeamDetails}>
        {chosenShifts && (
          <div className={`row g-2`}>
            <dt className={`col-5`}>
              Shift Preference:
            </dt>
            <dd className={`col`}>
              {chosenShifts.map(({name}) => name).join(', ')}
            </dd>
          </div>
        )}
      </dl>

      <hr/>

      <BowlerSummary bowler={bowler} tournament={tournament}/>
    </div>
  );
}

export default NewTeamReview;
