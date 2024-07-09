import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {resetRegistration} from "../../../store/actions/registrationActions";

import classes from './Sidebar.module.scss';

const Sidebar = ({
                   teamName,
                   shiftPreferences = [],
                   bowlers = [],
                   bowler = null
                 }) => {
  const {dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier} = router.query

  const resetClicked = (event) => {
    event.preventDefault();
    if (confirm('This will clear out all entered data, are you sure?')) {
      router.push(`/tournaments/${identifier}`);
      dispatch(resetRegistration());
    }
  }

  return (
    <div className={classes.Sidebar}>
      <p className={'text-center'}>
        <a href={'#'}
           onClick={resetClicked}>
          Start over
          <span className={'bi bi-arrow-counterclockwise ps-2'}></span>
        </a>
      </p>

      {teamName && (
        <p>
          <span className={classes.Label}>
            Team Name:
          </span>
          <span className={classes.Value}>
            {teamName}
          </span>
        </p>
      )}

      {bowler && (
        <p>
          <span className={classes.Label}>
            Bowler:
          </span>
          <span className={classes.Value}>
            {bowler.first_name} {bowler.nickname ? `"${bowler.nickname}"` : ''} {bowler.last_name}
          </span>
        </p>
      )}

      {shiftPreferences.length > 1 && (
        <div>
          <span className={classes.Label}>
            Shift Preferences:
          </span>
          <ul>
            {shiftPreferences.map(shift => (
              <li key={shift} className={classes.Value}>
                {shift}
              </li>
            ))}
          </ul>
        </div>
      )}

      {shiftPreferences.length === 1 && (
        <p>
          <span className={classes.Label}>
            Preferred Shift:
          </span>
          <span className={classes.Value}>
            {shiftPreferences[0]}
          </span>
        </p>
      )}

      {bowlers.length > 0 && (
        <div>
          <span className={classes.Label}>
            Bowlers:
          </span>
          <ul className={'list-group list-group-flush'}>
            {bowlers.map(bowler => (
              <li
                key={bowler.position}
                className={`list-group-item ${classes.Value}`}>
                <span className={'pe-2'}>
                  {bowler.position}.
                </span>
                {bowler.nickname ? bowler.nickname : bowler.first_name}{' '}
                {bowler.last_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
