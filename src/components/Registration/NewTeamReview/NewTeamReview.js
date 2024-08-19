import Link from "next/link";
import classes from "./NewTeamReview.module.scss";

const NewTeamReview = ({tournament, team}) => {
  if (!tournament || !team) {
    return '';
  }

  const shiftIdentifiers = team.shiftIdentifiers || [];
  const chosenShifts = tournament.shifts.length === 1
    ? ''
    : tournament.shifts.filter(({identifier}) => shiftIdentifiers.includes(identifier));

  return (
    <div className={classes.NewTeamReview}>
      <div className={classes.TeamDetails}>
        <dl>
          <div className={'row'}>
            <dt className={`col-5 pe-2`}>
              Team Name
            </dt>
            <dd className={`col ps-2 value`}>
              {team.name}
            </dd>
          </div>

          {chosenShifts && (
            <div className={`row g-2`}>
              <dt className={`col-5 pe-2`}>
                Shift Preference{chosenShifts.length === 1 ? '' : 's'}
              </dt>
              <dd className={`col`}>
                {chosenShifts.length === 1 && chosenShifts[0].name}
                {chosenShifts.length > 1 && (
                  <ul className={'list-group list-group-flush'}>
                    {chosenShifts.map(({identifier, name}) => (
                      <li key={identifier}
                          className={'list-group-item'}>
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          )}
        </dl>

        <div className={'row g-2'}>
          <p className={'offset-5 col'}>
            <Link href={`/tournaments/${tournament.identifier}/new-team?edit=true`}>
              Make a change
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewTeamReview;
