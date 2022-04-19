import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Map} from "immutable";
import Card from 'react-bootstrap/Card';

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './ShiftForm.module.scss';
import {directorApiRequest} from "../../../utils";

const ShiftForm = () => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialFormData = Map({
    name: '',
    description: '',
    capacity: 0,
    display_order: 1,

    valid: false,
  });

  const [formData, setFormData] = useState(initialFormData);
  const [formDisplayed, setFormDisplayed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // useEffect(() => {
  //
  // }, [context]);

  if (!context || !context.tournament) {
    return '';
  }

  const addClicked = (event) => {
    event.preventDefault();
    setFormDisplayed(true);
  }

  const formCancelled = (event) => {
    event.preventDefault();
    setFormDisplayed(false);
  }

  const inputChanged = (event) => {
    let newValue = event.target.value;
    const inputName = event.target.name;
    if (inputName === 'capacity' || inputName === 'display_order') {
      newValue = parseInt(newValue);
    }
    const newFormData = formData.withMutations(map => {
      map.set(inputName, newValue).set('valid', isValid(map));
    });
    setFormData(newFormData);
  }

  const isValid = (data) => {
    return data.get('name').length > 0 &&
      data.get('description').length > 0 &&
      data.get('capacity') > 0 &&
      data.get('display_order') > 0;
  }

  const formSubmitted = (event) => {
    event.preventDefault();

    const uri = `/director/tournaments/${context.tournament.identifier}/shifts`;
    const requestConfig = {
      method: 'post',
      data: {
        shift: {
          capacity: formData.get('capacity'),
          name: formData.get('name'),
          description: formData.get('description'),
          display_order: formData.get('display_order'),
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: addShiftSuccess,
      onFailure: addShiftFailure,
    })
  }

  const addShiftSuccess = (data) => {
    const tournament = {...context.tournament};
    tournament.shifts = context.tournament.shifts.concat(data);
    context.setTournament(tournament);
    setSuccessMessage('Shift added.');
    setFormData(initialFormData);
    setFormDisplayed(false);
  }

  const addShiftFailure = (data) => {
    console.log('damn', data);
  }

  const outerClasses = [classes.ShiftForm];
  if (formDisplayed) {
    outerClasses.push(classes.FormDisplayed);
  }

  return (
    <div className={outerClasses.join(' ')}>
      <Card.Body>
        {formDisplayed &&
          <form onSubmit={formSubmitted}>
            <div className={'row mb-3'}>
              <label htmlFor={'name'}
                     className={'form-label mb-1'}>
                Name
              </label>
              <div className={'col'}>
                <input type={'text'}
                       className={'form-control'}
                       name={'name'}
                       id={'name'}
                       required={true}
                       onChange={inputChanged}
                       value={formData.get('name')}
                />
              </div>
            </div>
            <div className={'row mb-3'}>
              <label htmlFor={'description'}
                     className={'form-label mb-1'}>
                Description
              </label>
              <div className={'col'}>
                <input type={'text'}
                       className={'form-control'}
                       name={'description'}
                       id={'description'}
                       required={true}
                       onChange={inputChanged}
                       value={formData.get('description')}
                />
              </div>
            </div>
            <div className={'row mb-3'}>
              <div className={'col-6'}>
                <label htmlFor={'capacity'} className={'form-label ps-0 mb-1'}>
                  Capacity
                </label>
                <input type={'number'}
                       className={'form-control'}
                       name={'capacity'}
                       id={'capacity'}
                       required={true}
                       onChange={inputChanged}
                       value={formData.get('capacity')}
                    />
              </div>
              <div className={'col-6'}>
                <label htmlFor={'display_order'} className={'form-label ps-0 mb-1'}>
                  Display Order
                </label>
                <input type={'number'}
                       className={'form-control'}
                       name={'display_order'}
                       id={'display_order'}
                       required={true}
                       onChange={inputChanged}
                       value={formData.get('display_order')}
                />
              </div>
            </div>
            <div className={'row'}>
              <div className={'d-flex justify-content-between'}>
                <button type={'button'}
                        title={'Cancel'}
                        onClick={formCancelled}
                        className={'btn btn-outline-danger'}>
                  <i className={'bi-x-lg pe-2'} aria-hidden={true}/>
                  Cancel
                </button>
                <button type={'submit'}
                        title={'Save'}
                        disabled={!formData.get('valid')}
                        className={'btn btn-success'}>
                  Save
                  <i className={'bi-chevron-right ps-2'} aria-hidden={true}/>
                </button>
              </div>
            </div>
          </form>
        }
        {!formDisplayed &&
          <div className={'text-center'}>
            <button type={'button'}
                    className={'btn btn-outline-primary'}
                    role={'button'}
                    onClick={addClicked}>
              <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
              Add
            </button>
          </div>
        }
        {successMessage && (
          <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'}
               role={'alert'}>
            <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
            <div className={'me-auto'}>
              {successMessage}
              <button type="button"
                      className={"btn-close"}
                      data-bs-dismiss="alert"
                      onClick={() => setSuccessMessage(null)}
                      aria-label="Close"/>
            </div>
          </div>
        )}

        {errorMessage}
      </Card.Body>
    </div>
  )
}

export default ShiftForm;