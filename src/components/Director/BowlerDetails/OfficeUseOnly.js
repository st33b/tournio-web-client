import classes from './OfficeUseOnly.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {Map} from 'immutable';
import ErrorBoundary from "../../common/ErrorBoundary";
import {Button, Card} from "react-bootstrap";
import {directorApiRequest} from "../../../utils";

const OfficeUseOnly = ({bowler}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialFormData = Map({
    verified_average: '',
    handicap: '',

    valid: false,
  });

  const [formData, setFormData] = useState(initialFormData);
  const [flashes, setFlashes] = useState({success: '', error: ''});

  // If there's a valid bowler prop, put their data into the form data
  useEffect(() => {
    if (!bowler) {
      return;
    }
    if (!bowler.verified_average || !bowler.handicap) {
      return;
    }
    const newFormData = formData.withMutations(map => {
      map.set('verified_average', bowler.verified_average)
        .set('handicap', bowler.handicap)
    });
    newFormData.set('valid', isValid(newFormData));
    setFormData(newFormData);
  }, [bowler]);

  const isValid = (data) => {
    return data.get('verified_average') >= 0 && data.get('handicap') >= 0;
  }

  const inputChanged = (event) => {
    const newValue = parseInt(event.target.value);
    const elemName = event.target.name;

    const newFormData = formData.set(elemName, newValue);
    setFormData(newFormData.set('valid', isValid(newFormData)));
  }

  const updateSuccess = (data) => {
    setFlashes({success: 'Data saved.'});
  }

  const updateFailure = (data) => {
    setFlashes({error: 'Failed to save data'});
  }

  const formSubmitted = (event) => {
    event.preventDefault();

    const uri = `/director/bowlers/${bowler.identifier}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler: {
          verified_data: {
            verified_average: formData.get('verified_average'),
            handicap: formData.get('handicap'),
          }
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: updateSuccess,
      onFailure: updateFailure,
    });
  }

  const errorAlert = flashes.error && (
    <div className={'alert alert-warning alert-dismissible fade show d-flex align-items-center mt-3 mb-0'}
         role={'alert'}>
      <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true}/>
      <div className={'me-auto'}>
        {flashes.error}
        <button type="button"
                className={"btn-close"}
                data-bs-dismiss="alert"
                onClick={() => setFlashes({error: '', success: ''})}
                aria-label="Close"/>
      </div>
    </div>
  );

  const successAlert = flashes.success && (
    <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'}
         role={'alert'}>
      <i className={'bi-check-lg pe-2'} aria-hidden={true}/>
      <div className={'me-auto'}>
        {flashes.success}
        <button type="button"
                className={"btn-close"}
                data-bs-dismiss="alert"
                onClick={() => setFlashes({error: '', success: ''})}
                aria-label="Close"/>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className={classes.OfficeUseOnly}>
        <Card className={'mb-3'}>
          <Card.Header as={'h6'} className={'fw-light'}>
            Tournament Data
          </Card.Header>
          <Card.Body>
            <form onSubmit={formSubmitted}>
              <div className={'row mb-1 mb-sm-2'}>
                <label className="col-12 col-sm-7 col-form-label text-sm-end pb-0" htmlFor='verified_average'>
                  Verified Average
                </label>
                <div className="col">
                  <input type={"number"}
                         className={'form-control'}
                         value={formData.get('verified_average')}
                         onChange={inputChanged}
                         min={0}
                         max={300}
                         name={'verified_average'}
                         id={'verified_average'}/>
                </div>
              </div>
              <div className={'row mb-1 mb-sm-0'}>
                <label className="col-12 col-sm-7 col-form-label text-sm-end pb-0" htmlFor='handicap'>
                  Tournament Handicap
                </label>
                <div className="col">
                  <input type={"number"}
                         className={'form-control'}
                         value={formData.get('handicap')}
                         onChange={inputChanged}
                         min={0}
                         max={300}
                         name={'handicap'}
                         id={'handicap'}/>
                </div>
              </div>
              <div className={'row'}>
                <div className={'text-center'}>
                  <Button variant={'primary'}
                          size={'sm'}
                          className={'mt-3'}
                          disabled={!formData.get('valid')}
                          type={'submit'}>
                    Save
                    <i className={'bi-chevron-right ps-2'} aria-hidden={true}/>
                  </Button>
                </div>
              </div>
            </form>
            {errorAlert}
            {successAlert}
          </Card.Body>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default OfficeUseOnly;