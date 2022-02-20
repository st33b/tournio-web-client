import {useState, useEffect, useMemo} from "react";
import axios from "axios";

import {Col, Row} from "react-bootstrap";

import {useAuthContext} from '../../../store/AuthContext';

import classes from './TournamentListing.module.scss';
import {useRouter} from "next/router";

const tournamentListing = () => {
  const authContext = useAuthContext();
  const router = useRouter();

  const theUrl = 'http://localhost:5000/director/tournaments';
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
    if (!authContext.user) {
      return;
    }
    if (data.length === 0) {
      axios.get(theUrl, requestConfig)
        .then(response => {
          const tournaments = response.data;
          if (tournaments.length === 1) {
            // Go ahead and take them to the details page for their one tournament.
            const identifier = tournaments[0]['identifier'];
            router.push('/director/tournaments/'+ identifier);
            return;
          }
          setData(tournaments);
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
    list = <p>Retrieving tournaments...</p>;
  } else if (data.length === 0) {
    list = <p>No tournaments to display.</p>;
  } else {
    list = (
      <div className={'table-responsive'}>
        <table className={'table table-striped'}>
          <thead className={'table-light'}>
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
          {data.map((row) => {
            let bgColor = '';
            let textColor = 'text-white';
            switch (row.state) {
              case 'setup':
                bgColor = 'bg-light';
                textColor = 'text-dark';
                break;
              case 'testing':
                bgColor = 'bg-warning';
                textColor = 'text-dark';
                break;
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
              <tr key={row.identifier}>
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
                <td className={bgColor + ' ' + textColor}>
                  {row.status}
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
    <div className={classes.TournamentListing}>
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

export default tournamentListing;