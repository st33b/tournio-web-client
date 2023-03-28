import {Col, Row} from "react-bootstrap";

import {useDirectorContext} from '../../../store/DirectorContext';

import classes from './TournamentListing.module.scss';

const TournamentListing = ({tournaments}) => {
  if (!tournaments) {
    return '';
  }
  return (
    <div>
      <Row>
        <Col>
          {tournaments.length === 0 && <h3 className={'display-6 text-center pt-2'}>No tournaments to display.</h3>}
          {tournaments.length > 0 && (
            <div className={'table-responsive'}>
              <table className={'table'}>
                <thead>
                <tr>
                  <th>
                    Name
                  </th>
                  <th>
                    Year
                  </th>
                  <th>
                    Start Date
                  </th>
                  <th>
                    State
                  </th>
                </tr>
                </thead>
                <tbody>
                {tournaments.map((row) => {
                  return (
                    <tr key={row.identifier} className={classes.TournamentState}>
                      <td>
                        <a href={'/director/tournaments/' + row.identifier}>
                          {row.name}
                        </a>
                      </td>
                      <td>
                        {row.year}
                      </td>
                      <td>
                        {row.start_date}
                      </td>
                      <td className={classes[row.state]}>
                        {row.status}
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TournamentListing;
