import {useEffect, useState} from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import {directorApiRequest, directorApiDownloadRequest} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";
import {testDataCleared, tournamentTestEnvironmentUpdated} from "../../../store/actions/directorActions";

import classes from './TournamentInPrep.module.scss';
import statusClasses from '../TournamentListing/TournamentListing.module.scss';

const StatusAndCounts = ({tournament}) => {
  const context = useDirectorContext();
  const dispatch = context.dispatch;

  const testEnvFormInitialData = {
    registration_period: 'regular',
  }

  const [downloadMessage, setDownloadMessage] = useState(null);
  const [clearTestDataSuccessMessage, setClearTestDataSuccessMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [testEnvFormData, setTestEnvFormData] = useState(testEnvFormInitialData);
  const [testEnvSuccessMessage, setTestEnvSuccessMessage] = useState(null);

  // Update the state of testEnvFormData with what's in context
  useEffect(() => {
    if (!context || !tournament) {
      return;
    }

    if (tournament.state !== 'setup') {
      const formData = {...testEnvFormData};

      Object.keys(tournament.available_conditions).forEach(name => {
        formData[name] = tournament.testing_environment.settings[name].value;
      });

      setTestEnvFormData(formData);
    }
  }, [context, tournament]);

  if (!context || !tournament) {
    return '';
  }

  const downloadSuccess = (data, name) => {
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadMessage(
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'}
           role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          Download completed.
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setDownloadMessage(null)}
                  aria-label="Close"/>
        </div>
      </div>
    );
  }
  const downloadFailure = (data) => {
    setDownloadMessage(
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'}
           role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          Download failed. {data.error}
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setDownloadMessage(null)}
                  aria-label="Close"/>
        </div>
      </div>
    );
  }
  const downloadClicked = (event, uri, saveAsName) => {
    event.preventDefault();
    if (tournament.state === 'setup') {
      alert('You will be able to download this file once setup is complete');
      return;
    }
    directorApiDownloadRequest({
      uri: uri,
      context: context,
      onSuccess: (data) => downloadSuccess(data, saveAsName),
      onFailure: (data) => downloadFailure(data),
    });
  }

  const counts = (
    <ListGroup variant={'flush'}>
      <ListGroup.Item className={'d-flex'}
                      action
                      href={`/director/bowlers`}>
        Bowlers
        <Badge bg={'light'} text={'dark'} className={'ms-auto'}>
          {tournament.bowler_count}
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item className={'d-flex'}
                      action
                      href={`/director/teams`}>
        Teams
        <Badge bg={'light'} text={'dark'} className={'ms-auto'}>
          {tournament.team_count}
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item className={'d-flex'}
                      action
                      href={`/director/free_entries`}>
        Free Entries
        <Badge bg={'light'} text={'dark'} className={'ms-auto'}>
          {tournament.free_entry_count}
        </Badge>
      </ListGroup.Item>
    </ListGroup>
  );

  const downloads = (
    <Card.Body>
      <Card.Subtitle className={'mb-3'}>
        Downloads
      </Card.Subtitle>
      <Card.Link className={'btn btn-sm btn-outline-primary'}
                 href={'#'}
                 onClick={(event) => downloadClicked(event, `/director/tournaments/${tournament.identifier}/csv_download`, 'bowlers.csv')}
      >
        CSV
      </Card.Link>
      <Card.Link className={'btn btn-sm btn-outline-primary'}
                 href={'#'}
                 onClick={(event) => downloadClicked(event, `/director/tournaments/${tournament.identifier}/igbots_download`, 'bowlers.xml')}
      >
        IGBO-TS
      </Card.Link>
      {downloadMessage}
    </Card.Body>
  );

  const onClearTestDataSuccess = (_) => {
    dispatch(testDataCleared());
    setLoading(false);
    setClearTestDataSuccessMessage('Test data cleared!');
  }

  const onClearTestDataFailure = (data) => {
    console.log('Oopsie!', data);
    setLoading(false);
  }

  const clearTestDataClickHandler = () => {
    const uri = `/director/tournaments/${tournament.identifier}/clear_test_data`;
    const requestConfig = {
      data: {},
      method: 'post',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: onClearTestDataSuccess,
      onFailure: onClearTestDataFailure,
    });
  }

  const testSettingOptionClicked = (event) => {
    const settingName = event.target.name;
    const newValue = event.target.value;
    const newForm = {...testEnvFormData};
    newForm[settingName] = newValue;
    setTestEnvFormData(newForm);
  }

  const testEnvSaveSuccess = (data) => {
    dispatch(tournamentTestEnvironmentUpdated(data));
    setTestEnvSuccessMessage('Testing environment updated.');
  }

  const testEnvSaved = (event) => {
    event.preventDefault();
    const uri = `/director/tournaments/${tournament.identifier}/testing_environment`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        testing_environment: {
          conditions: testEnvFormData,
        },
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: testEnvSaveSuccess,
      onFailure: (data) => console.log('Oops.', data),
    });
  }

  let clearTestData = '';
  let testingStatusContent = '';
  if (tournament.state === 'testing' || tournament.state === 'demo') {
    let success = '';
    if (clearTestDataSuccessMessage) {
      success = (
        <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'}
             role={'alert'}>
          <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
          <div className={'me-auto'}>
            {clearTestDataSuccessMessage}
            <button type="button"
                    className={"btn-close"}
                    data-bs-dismiss="alert"
                    onClick={() => setClearTestDataSuccessMessage(null)}
                    aria-label="Close"/>
          </div>
        </div>
      );
    }
    clearTestData = (
      <Card.Body>
        <Card.Text>
          {!loading && (
            <Button variant={'warning'} onClick={clearTestDataClickHandler}>
              Clear Registration Data
            </Button>
          )}
          {loading && (
            <Button variant={'secondary'} disabled>
              Clearing...
            </Button>
          )}
        </Card.Text>
        {success}
      </Card.Body>
    )
    success = '';
    if (testEnvSuccessMessage) {
      success = (
        <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'}
             role={'alert'}>
          <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
          <div className={'me-auto'}>
            {testEnvSuccessMessage}
            <button type="button"
                    className={"btn-close"}
                    data-bs-dismiss="alert"
                    onClick={() => setTestEnvSuccessMessage(null)}
                    aria-label="Close"/>
          </div>
        </div>
      );
    }
    testingStatusContent = (
      <Card.Body className={'border-bottom border-top'}>
        <Card.Title as={'h6'} className={'fw-light mb-3'}>
          Environment Setup
        </Card.Title>

        <form onSubmit={testEnvSaved}>
          {Object.values(tournament.testing_environment.settings).map(setting => (
            <div className={'row text-start d-flex align-items-center py-3'} key={setting.name}>
              <label className={'col-6 text-end fst-italic'}>
                {setting.display_name}
              </label>
              <div className={'col'}>
                {tournament.available_conditions[setting.name].options.map(option => (
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
    );
  }

  const frontPageLink = (
    <Card.Body>
      <a href={`/tournaments/${tournament.identifier}`} target={'_new'}>
        Front Page
        <i className={classes.ExternalLink + " bi-box-arrow-up-right"} aria-hidden="true"/>
      </a>
    </Card.Body>
  );

  return (
    <Card className={[classes.Card, 'text-center', statusClasses.TournamentState].join(' ')}>
      <Card.Header as={'h5'} className={statusClasses[tournament.state]}>
        {tournament.status}
      </Card.Header>
      {tournament.state !== 'setup' && counts}
      {frontPageLink}
      {tournament.state !== 'setup' && downloads}
      {testingStatusContent}
      {clearTestData}
    </Card>
  );
}

export default StatusAndCounts;
