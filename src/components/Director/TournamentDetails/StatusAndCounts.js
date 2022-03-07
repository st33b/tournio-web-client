import {useState} from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import axios from "axios";

import {apiHost} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import classes from './TournamentDetails.module.scss';

const statusAndCounts = ({testEnvironmentUpdated}) => {
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
                      href={`/director/free_entries`}>
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

  const testEnvFormInitialData = {
    registration_period: 'regular',
  }
  if (context.tournament.state === 'testing') {
    Object.keys(context.tournament.available_conditions).forEach(name => {
      testEnvFormInitialData[name] = context.tournament.testing_environment.settings[name].value;
    });
  }

  const [testEnvFormData, setTestEnvFormData] = useState(testEnvFormInitialData);

  const testSettingOptionClicked = (event) => {
    const settingName = event.target.name;
    const newValue = event.target.value;
    const newForm = {...testEnvFormData};
    newForm[settingName] = newValue;
    setTestEnvFormData(newForm);
  }

  const [successMessage, setSuccessMessage] = useState(null);
  const testEnvSaveSuccess = () => {
    setSuccessMessage('Testing environment updated.');
  }

  const testEnvSaved = (event) => {
    event.preventDefault();
    testEnvironmentUpdated(testEnvFormData, testEnvSaveSuccess);
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
      let success = '';
      if (successMessage) {
        success = (
          <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
            <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
            <div className={'me-auto'}>
              {successMessage}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" />
            </div>
          </div>
        );
      }
      testingStatusContent = (
        <Card.Body className={'bg-white text-dark border-bottom border-top'}>
          <Card.Title as={'h6'} className={'fw-light mb-3'}>
            Testing Environment
          </Card.Title>

          <form onSubmit={testEnvSaved}>
            {Object.values(context.tournament.testing_environment.settings).map(setting => (
              <div className={'row text-start d-flex align-items-center py-3'} key={setting.name}>
                <label className={'col-6 text-end fst-italic'}>
                  {setting.display_name}
                </label>
                <div className={'col'}>
                  {context.tournament.available_conditions[setting.name].options.map(option => (
                    <div className={'form-check'} key={option.value}>
                      <input type={'radio'}
                             name={setting.name}
                             id={`${setting.name}-${setting.value}`}
                             className={'form-check-input'}
                             value={option.value}
                             checked={testEnvFormData[setting.name] === option.value}
                             onChange={(event) => testSettingOptionClicked(event)}
                      />
                      <label className={'form-check-label'}
                             htmlFor={`${setting.name}-${setting.value}`}>
                        {option.display_value}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className={'row mt-3'}>
              <div className={'col-12'}>
                <button type={'submit'} className={'btn btn-primary'}>
                  Save
                </button>
                {success}
              </div>
            </div>
          </form>
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
      <Card.Header as={'h5'}>
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