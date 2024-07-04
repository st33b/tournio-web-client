const Sidebar = ({
                   shiftPreferences = [],
                   bowlers = [],
                 }) => {

  return (
    <div className={''}>
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
