import {useState} from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import axios from "axios";

import {apiHost} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import classes from './TournamentDetails.module.scss';

const statusAndCounts = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  const downloads = (
    <Card.Body className={'bg-white text-dark'}>
      <Card.Subtitle className={'mb-3'}>
        Downloads
      </Card.Subtitle>
      <Card.Link className={'btn btn-sm btn-outline-primary'}
                 href={`/api/director/tournaments/${context.tournament.identifier}/csv_download`}>
        CSV
      </Card.Link>
      <Card.Link className={'btn btn-sm btn-outline-primary'}
                 href={`/api/director/tournaments/${context.tournament.identifier}/igbots_download`}>
        IGBO-TS
      </Card.Link>
    </Card.Body>
  );

  const counts = (
    <ListGroup variant={'flush'}>
      <ListGroup.Item className={'d-flex'}
                      action
                      href={`/director/bowlers`}>
        Bowlers
        <Badge bg={'light'} text={'dark'} className={'ms-auto'}>
          {context.tournament.bowler_count}
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item className={'d-flex'}
                      action
                      href={`/director/teams`}>
        Teams
        <Badge bg={'light'} text={'dark'} className={'ms-auto'}>
          {context.tournament.team_count}
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item className={'d-flex'}
                      action
                      href={`/director/tournaments/${context.tournament.identifier}/free_entries`}>
        Free Entries
        <Badge bg={'light'} text={'dark'} className={'ms-auto'}>
          {context.tournament.free_entry_count}
        </Badge>
      </ListGroup.Item>
    </ListGroup>
  );

  const [loading, setLoading] = useState(false);
  const clearTestDataClickHandler = () => {
    if (context.tournament.state !== 'testing') {
      console.log('Cannot clear data for a tournament that is not in setup or testing.');
      return;
    }

    const theUrl = `${apiHost}/director/tournaments/${context.tournament.identifier}/clear_test_data`;
    const requestConfig = {
      url: theUrl,
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      },
      data: {},
      method: 'post',
    }
    setLoading(true);
    axios(requestConfig)
      .then(response => {
        setLoading(false);
        alert('Test data cleared. Refresh the page to see counts go to zero.');
      })
      .catch(error => {
        setLoading(false);
      });
  }

  let clearTestData = '';
  let testingStatusContent = '';
  let bgColor = '';
  let textColor = 'white';
  switch (context.tournament.state) {
    case 'setup':
      bgColor = 'info';
      textColor = 'dark';
      break;
    case 'testing':
      bgColor = 'warning';
      clearTestData = (
        <Card.Body className={'bg-white text-dark'}>
          <Card.Text>
            {!loading && (
              <Button variant={'warning'} onClick={clearTestDataClickHandler}>
                Clear Test Data
              </Button>
            )}
            {loading && (
              <Button variant={'secondary'} disabled>
                Clearing...
              </Button>
            )}
          </Card.Text>
        </Card.Body>
      )
      testingStatusContent = (
        <Card.Body className={'bg-white text-dark'}>
          <Card.Title>
            Testing Environment
          </Card.Title>
          <dl>
            {context.tournament.testing_environment.settings.map((condition) => {
              return (
                <div className={'row'} key={condition.name}>
                  <dt className={'col-6 text-end'}>
                    {condition.display_name}
                  </dt>
                  <dd className={'col text-start'}>
                    {condition.display_value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Card.Body>
      )
      break;
    case 'active':
      bgColor = 'success';
      break;
    case 'closed':
      bgColor = 'secondary';
      break;
    default:
      bgColor = 'dark';
  }

  const frontPageLink = (
    <Card.Body className={'bg-white text-dark'}>
      <a href={`/tournaments/${context.tournament.identifier}`} target={'_new'}>
        Front Page
        <i className={classes.ExternalLink + " bi-box-arrow-up-right"} aria-hidden="true"/>
      </a>
    </Card.Body>
  );

  return (
    <Card bg={bgColor} text={textColor} className={classes.Card + ' text-center'}>
      <Card.Header as={'h4'}>
        {context.tournament.status}
      </Card.Header>
      {counts}
      {frontPageLink}
      {downloads}
      {testingStatusContent}
      {clearTestData}
    </Card>
  );
}

export default statusAndCounts;