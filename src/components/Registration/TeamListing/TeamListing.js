import classes from './TeamListing.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";

const TeamListing = ({teams, caption, includeShift, context}) => {
  if (!teams) {
    return '';
  }

  if (teams.length === 0) {
    return (
      <div className={classes.TeamListing}>
        <h5>
          {caption}
        </h5>
        <p className={'lead'}>
          None found
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={classes.TeamListing}>
        <div className={'table-responsive'}>
          <h5 className={'text-center text-md-start'}>
            {caption}
          </h5>
          <table className={'table table-striped table-hover caption-top'}>
            <thead className={''}>
            <tr>
              <th>Name</th>
              <th>Date Registered</th>
              {includeShift && <th>Requested Shift</th>}
              <th>Bowlers</th>
            </tr>
            </thead>
            <tbody>
            {teams.map((t, i) => {
              return (
                <tr key={i}>
                  <td>
                    <a href={`/teams/${t.identifier}?context=${context}`}>
                      {t.name}
                    </a>
                  </td>
                  <td>
                    {t.date_registered}
                  </td>
                  {includeShift && <td>{t.shift.name}</td>}
                  <td>
                    {t.size}
                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default TeamListing;