import {useState, useEffect, useMemo} from "react";
import {useTable, useSortBy} from 'react-table';

import axios from "axios";

import {Button, Card, Col, Row, Table} from "react-bootstrap";

import {useAuthContext} from '../../../store/AuthContext';

import classes from './UserListing.module.scss';

const userListing = () => {
  const authContext = useAuthContext();

  const theUrl = 'http://localhost:5000/director/users';
  const requestConfig = {
    headers: {
      'Accept': 'application/json',
      'Authorization': authContext.token,
    },
  }

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let errorMessage = '';

  useEffect(() => {
    if (data.length === 0) {
      axios.get(theUrl, requestConfig)
        .then(response => {
          const users = response.data;
          setData(users);
          setLoading(false);
        })
        .catch(error => {
          errorMessage = error;
          setLoading(false);
        });
    }
  });

  let list = '';
  if (loading) {
    list = <p>Retrieving users...</p>;
  } else if (data.length === 0) {
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
          {data.map((row) => {
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
      {errorMessage && (
        <Row>
          <Col>
            <p className={'text-danger'}>
              {errorMessage}
            </p>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          {list}
        </Col>
      </Row>
    </div>
  );
};

export default userListing;