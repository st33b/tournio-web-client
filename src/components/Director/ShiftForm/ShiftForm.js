import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Map} from "immutable";
import Card from 'react-bootstrap/Card';

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './ShiftForm.module.scss';
import {directorApiRequest} from "../../../utils";

const ShiftForm = ({shift}) => {
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

  useEffect(() => {
    if (!shift) {
      return;
    }
    const existingShift = {
      name: shift.name,
      description: shift.description,
      capacity: shift.capacity,
      display_order: shift.display_order,

      valid: true,
    };
    setFormData(Map(existingShift));
  }, [shift]);

  if (!context || !context.tournament) {
    return '';
  }

  const allowDelete = shift && (context.tournament.state !== 'active' || context.tournament.state !== 'demo');

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

  const addShiftFormSubmitted = (event) => {
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

  const toggleEdit = (event) => {
    event.preventDefault();
    setFormDisplayed(!formDisplayed);
  }

  const deleteShift = (event) => {
    event.preventDefault();
    if (!allowDelete) {
      return;
    }
    const uri = `/director/shifts/${shift.identifier}`;
    const requestConfig = {
      method: 'delete',
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: deleteShiftSuccess,
      onFailure: deleteShiftFailure,
    });
  }

  const deleteShiftSuccess = (data) => {
    const tournament = {...context.tournament};
    tournament.shifts = context.tournament.shifts.filter(s => s.identifier !== shift.identifier);
    context.setTournament(tournament);
    // Anything else we need to do? I'm pretty sure a re-render will take this component instance away entirely...
  }

  const deleteShiftFailure = (data) => {
    console.log("Uh oh...", data);
  }

  const updateShiftFormSubmitted = (event) => {
    event.preventDefault();

    const uri = `/director/shifts/${shift.identifier}`;
    const requestConfig = {
      method: 'patch',
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
      onSuccess: updateShiftSuccess,
      onFailure: updateShiftFailure,
    })
  }

  const updateShiftSuccess = (data) => {
    const tournament = {...context.tournament};
    tournament.shifts = [...context.tournament.shifts];
    const index = tournament.shifts.findIndex(s => s.identifier === shift.identifier)
    tournament.shifts[index] = data;
    context.setTournament(tournament);
    setSuccessMessage('Shift updated.');
    setFormDisplayed(false);
  }

  const updateShiftFailure = (data) => {
    console.log('damn', data);
  }

  let submitFunction = addShiftFormSubmitted;
  if (shift) {
    submitFunction = updateShiftFormSubmitted;
  }

  return (
    <div className={outerClasses.join(' ')}>
      {!formDisplayed && !shift &&
        <Card.Body>
          <div className={'text-center'}>
            <button type={'button'}
                    className={'btn btn-outline-primary'}
                    role={'button'}
                    onClick={addClicked}>
              <i className={'bi-plus-lg'} aria-hidden={true}/>{' '}
              Add
            </button>
          </div>
        </Card.Body>
      }
      {!formDisplayed && shift &&
        <a href={'#'}
           className={'text-body text-decoration-none'}
           title={'Edit details'}
           onClick={toggleEdit}>
          <dl className={classes.ExistingShift}>
            <div className={'row'}>
              <dt className={'col-5'}>
                Display Order
              </dt>
              <dd className={'col'}>
                {shift.display_order}
              </dd>
            </div>
            <div className={'row'}>
              <dt className={'col-5'}>
                Name
              </dt>
              <dd className={'col'}>
                {shift.name}
              </dd>
            </div>
            <div className={'row'}>
              <dt className={'col-5'}>
                Description
              </dt>
              <dd className={'col'}>
                {shift.description}
              </dd>
            </div>
            <div className={'row'}>
              <dt className={'col-5'}>
                Capacity
              </dt>
              <dd className={'col'}>
                {shift.capacity} teams
              </dd>
            </div>
            <div className={'row'}>
              <dt className={'col-5'}>
                Confirmed teams
              </dt>
              <dd className={'col'}>
                {shift.confirmed_count}
              </dd>
            </div>
            <div className={'row'}>
              <dt className={'col-5'}>
                Requested teams
              </dt>
              <dd className={'col'}>
                {shift.requested_count}
              </dd>
            </div>
          </dl>
        </a>
      }
      {formDisplayed &&
        <Card.Body>
          <form onSubmit={submitFunction}>
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
              <div className={'d-flex justify-content-end'}>
                {allowDelete && (
                  <button type={'button'}
                          title={'Delete'}
                          onClick={deleteShift}
                          className={'btn btn-danger me-auto'}>
                    <i className={'bi-slash-circle pe-2'} aria-hidden={true}/>
                    Delete
                  </button>
                )}
                <button type={'button'}
                        title={'Cancel'}
                        onClick={formCancelled}
                        className={'btn btn-outline-dark me-2'}>
                  <i className={'bi-x-lg'} aria-hidden={true}/>
                  <span className={'visually-hidden'}>
                    Cancel
                  </span>
                </button>
                <button type={'submit'}
                        title={'Save'}
                        disabled={!formData.get('valid')}
                        className={'btn btn-success'}>
                  <i className={'bi-check-lg'} aria-hidden={true}/>
                  <span className={'visually-hidden'}>
                    Save
                  </span>
                </button>
              </div>
            </div>
          </form>
        </Card.Body>
      }
      {successMessage && (
        <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mx-3'}
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
    </div>
  )
}

export default ShiftForm;