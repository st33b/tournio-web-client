
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {resetRegistration} from "../../../store/actions/registrationActions";
import {useRouter} from "next/router";

const Sidebar = ({
                   shiftPreferences = [],
                   bowlers = [],
                 }) => {
  const {dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier} = router.query

  const resetClicked = (event) => {
    event.preventDefault();
    if (confirm('This will clear out all entered data, are you sure?')) {
      dispatch(resetRegistration());
      router.push(`/tournaments/${identifier}`);
    }
  }

  return (
    <div className={''}>
      <p className={'text-center'}>
        <a href={'#'}
           onClick={resetClicked}>
          Start over
          <span className={'bi bi-arrow-counterclockwise ps-2'}></span>
        </a>
      </p>

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
