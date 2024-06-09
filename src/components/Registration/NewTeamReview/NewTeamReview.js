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
      <div className={classes.TeamDetails}>
        <dl>
          <div className={'row'}>
            <dt className={`col-4 pe-2`}>
              Team Name
            </dt>
            <dd className={`col ps-2 value`}>
              {team.name}
            </dd>
          </div>

          {chosenShifts && (
            <div className={`row g-2`}>
              <dt className={`col-4 pe-2`}>
                Shift Preference
              </dt>
              <dd className={`col`}>
                {chosenShifts.map(({name}) => name).join(', ')}
              </dd>
            </div>
          )}
        </dl>
      </div>


      <BowlerSummary bowler={bowler} tournament={tournament}/>
    </div>
  );
}

export default NewTeamReview;
