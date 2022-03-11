import {useState, useEffect, useMemo} from "react";
import axios from "axios";

import {Col, Row} from "react-bootstrap";

import {apiHost} from "../../../utils";
import {useDirectorContext} from '../../../store/DirectorContext';

import classes from './TournamentListing.module.scss';
import {useRouter} from "next/router";

const tournamentListing = () => {
  const directorContext = useDirectorContext();
  const router = useRouter();

  const theUrl = `${apiHost}/director/tournaments`;
  const requestConfig = {
    headers: {
      'Accept': 'application/json',
      'Authorization': directorContext.token,
    },
  }

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (!directorContext.user) {
      return;
    }
    if (data.length === 0) {
      axios.get(theUrl, requestConfig)
        .then(response => {
          const tournaments = response.data;
          if (tournaments.length === 1) {
            // Go ahead and take them to the details page for their one tournament.
            const identifier = tournaments[0]['identifier'];
            router.push(`/director/tournaments/${identifier}`);
            return;
          }
          setData(tournaments);
          setLoading(false);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 401) {
              directorContext.logout();
              router.push('/director/login');
            }
            setErrorMessage(error.statusText);
          } else {
            setErrorMessage('An unknown error occurred!');
          }
          setLoading(false);
        });
    }
  });

  let list = '';
  if (loading) {
    list = <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>;
  } else if (data.length === 0) {
    list = <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>;
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