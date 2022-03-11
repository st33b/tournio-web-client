import {Col, Row} from "react-bootstrap";

import classes from './UserListing.module.scss';

const userListing = ({users}) => {
  let list = '';
  if (!users) {
    list = <p>Retrieving users...</p>;
  } else if (users.length === 0) {
    list = <p>No users to display.</p>;
  } else {
    list = (
      <div className={'table-responsive'}>
        <table className={'table table-striped'}>
          <thead className={'table-light'}>
          <tr>
            <th>
              Email
            </th>
            <th>
              Role
            </th>
            <th>
              Tournament(s)
            </th>
          </tr>
          </thead>
          <tbody>
          {users.map((row) => {
            return (
              <tr key={row.identifier}>
                <td>
                  <a href={'/director/users/' + row.identifier}>
                    {row.email}
                  </a>
                </td>
                <td>
                  {row.role}
                </td>
                <td>
                  {row.tournaments.map(t => (t.name)).join(', ')}
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={classes.UserListing}>
      <Row>
        <Col>
          {list}
        </Col>
      </Row>
    </div>
  );
};

export default userListing;