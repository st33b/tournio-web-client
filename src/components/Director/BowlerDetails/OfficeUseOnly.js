import classes from './OfficeUseOnly.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {Map} from 'immutable';
import ErrorBoundary from "../../common/ErrorBoundary";
import {Button, Card} from "react-bootstrap";

const OfficeUseOnly = ({bowler}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialFormData = Map({
    verified_average: '',
    handicap: '',

    valid: false,
  });

  const [formData, setFormData] = useState(initialFormData);

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

  const formSubmitted = (event) => {
    event.preventDefault();
    // ...
  }

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
          </Card.Body>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default OfficeUseOnly;