import {useState, useEffect} from "react";

import {fetchTournamentList} from "../../../utils";

import classes from './TournamentListing.module.scss';

const tournamentListing = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const onFetchSuccess = (data) => {
    setTournaments(data);
    setLoading(false);
  }

  const onFetchFailure = (data) => {
    setLoading(false);
  }

  useEffect(() => {
    fetchTournamentList(onFetchSuccess, onFetchFailure);
  }, []);

  if (loading) {
    return (
      <div className={classes.TournamentListing}>
        <h2>
          Upcoming Tournaments
        </h2>
        <p>
          Retrieving list of tournaments...
        </p>
      </div>
    );
  }

  return (
    <div className={classes.TournamentListing}>
      <h2>
        Upcoming Tournaments
      </h2>
      {tournaments.length === 0 && <p>No tournaments to display.</p>}
      {tournaments.length > 0 && (
        <div className={'table-responsive'}>
          <table className={'table table-striped'}>
            <thead className={'table-light'}>
            <tr>
              <th>
                Name
              </th>
              <th>
                Location
              </th>
              <th>
                Start Date
              </th>
              <th>
                Status
              </th>
            </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => {
                let bgColor = '';
                let textColor = 'text-white';
                switch (t.state) {
                  case 'active':
                    bgColor = 'bg-success';
                    break;
                  case 'closed':
                    bgColor = 'bg-secondary';
                    break;
                  default:
                    bgColor = 'bg-dark';
                }
                return (
                  <tr key={t.identifier}>
                    <td>
                      <a href={`/tournaments/${t.identifier}`}>
                        {t.name}
                      </a>
                    </td>
                    <td>
                      {t.location}
                    </td>
                    <td>
                      {t.start_date}
                    </td>
                    <td className={bgColor + ' ' + textColor}>
                      {t.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default tournamentListing;