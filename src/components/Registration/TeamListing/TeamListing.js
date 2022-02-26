

import classes from './TeamListing.module.scss';

const teamListing = ({teams, caption}) => {
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
    <div className={classes.TeamListing}>
      <div className={'table-responsive'}>
        <table className={'table table-striped table-hover caption-top'}>
          <caption>
            {caption}
          </caption>
          <thead className={'table-light'}>
            <tr>
              <th>Name</th>
              <th>Date Registered</th>
              <th>Bowlers</th>
            </tr>
          </thead>
          <tbody>
          {teams.map((t, i) => {
            return (
              <tr key={i}>
                <td>
                  <a href={`/teams/${t.identifier}`}>
                    {t.name}
                  </a>
                </td>
                <td>
                  {t.date_registered}
                </td>
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
  );
}

export default teamListing;