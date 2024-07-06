import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {resetRegistration} from "../../../store/actions/registrationActions";

import classes from './Sidebar.module.scss';

const Sidebar = ({
                   teamName,
                   shiftPreferences = [],
                   bowlers = [],
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

      {shiftPreferences.length > 1 && (
        <div>
          <p>Shift Preferences:</p>
          <ul>
            {shiftPreferences.map(shift => (
              <li key={shift}>
                {shift}
              </li>
            ))}
          </ul>
        </div>
      )}

      {shiftPreferences.length === 1 && (
        <p>Shift Preference: {shiftPreferences[0]}</p>
      )}

      {bowlers.length > 0 && (
        <div>
          <p>Bowlers:</p>
          <ul>
            {bowlers.map(bowler => (
              <li
                key={bowler.position}>{bowler.position}. {bowler.preferredName ? bowler.preferredName : bowler.firstName} {bowler.lastName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
