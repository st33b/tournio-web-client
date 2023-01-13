import {useEffect, useState} from "react";
import {Map} from "immutable";
import Card from 'react-bootstrap/Card';

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";

import classes from './ShiftForm.module.scss';
import {
  tournamentShiftAdded,
  tournamentShiftDeleted,
  tournamentShiftUpdated
} from "../../../store/actions/directorActions";

const ShiftForm = ({tournament, shift}) => {
  const context = useDirectorContext();

  const initialFormData = Map({
    name: '',
    description: '',
    capacity: 0,
    display_order: 1,

    valid: false,
  });

  const [formData, setFormData] = useState(initialFormData);
  const [formDisplayed, setFormDisplayed] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Populate form data with the shift prop
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

  if (!context || !tournament) {
    return '';
  }

  const allowDelete = shift && (tournament.state !== 'active' && tournament.state !== 'demo');

  const addClicked = (event) => {
    event.preventDefault();
    setFormDisplayed(true);
  }

  const formCancelled = (event) => {
    event.preventDefault();
    setFormDisplayed(false);
  }

  const inputChanged = (event) => {
    let newValue = '';
    let inputName = event.target.name;
    switch (inputName) {
      case 'capacity':
      case 'display_order':
        newValue = parseInt(event.target.value);
        break;
      case 'name':
      case 'description':
        newValue = event.target.value;
        break;
      default:
        break;
    }
    const newFormData = formData.withMutations(map => {
      map.set(inputName, newValue).set('valid', isValid(map));
    });
    setFormData(newFormData);
  }

  const isValid = (data) => {
    return data.get('capacity') > 0 &&
      data.get('display_order') > 0;
  }

  const addShiftFormSubmitted = (event) => {
    event.preventDefault();

    const uri = `/director/tournaments/${tournament.identifier}/shifts`;
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
      onSuccess: (data) => context.dispatch(tournamentShiftAdded(data)),
      onFailure: (data) => console.log("D'oh!", data),
    });
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
      onSuccess: () => context.dispatch(tournamentShiftDeleted(shift)),
      onFailure: (data) => console.log("D'oh!", data),
    });
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
      onSuccess: updateShiftSuccess,
      onFailure: (data) => console.log("D'oh!", data),
    })
  }

  const updateShiftSuccess = (data) => {
    context.dispatch(tournamentShiftUpdated(data));
    setSuccessMessage('Shift updated.');
    setFormDisplayed(false);
  }

  let submitFunction = addShiftFormSubmitted;
  let colorClass = '';
  if (shift) {
    submitFunction = updateShiftFormSubmitted;
    if (shift.confirmed_count === shift.capacity) {
      colorClass = classes.Full;
    } else if (shift.confirmed_count + shift.requested_count + 16 >= shift.capacity) {
      colorClass = classes.AlmostFull;
    }
  }

  const outerClasses = [classes.ShiftForm];
  if (formDisplayed) {
    outerClasses.push(classes.FormDisplayed);
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
          <dl className={`${classes.ExistingShift} px-2`}>
            <div className={'row'}>
              <dt className={'col-4'}>
                Order
              </dt>
              <dd className={'col'}>
                {shift.display_order}
              </dd>
            </div>
            <div className={'row'}>
              <dt className={'col-4'}>
                Name
              </dt>
              <dd className={'col'}>
                {shift.name}
              </dd>
            </div>
            <div className={'row'}>
              <dt className={'col-4'}>
                Description
              </dt>
              <dd className={'col'}>
                {shift.description}
              </dd>
            </div>

            <div className={`row ${colorClass} g-3`}>
              <dt className={'col-6 mt-2'}>
                Capacity
              </dt>
              <dd className={'col mt-2'}>
                {shift.capacity} bowlers
              </dd>
            </div>
            <div className={`row ${colorClass} g-3`}>
              <dt className={'col-6'}>
                Confirmed
              </dt>
              <dd className={'col'}>
                {shift.confirmed_count}
              </dd>
            </div>
            <div className={`row ${colorClass} g-3`}>
              <dt className={'col-6'}>
                Requested
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
                     className={'form-label mb-1 col-12'}>
                Name
              </label>
              <div className={'col-12'}>
                <input type={'text'}
                       className={'form-control'}
                       name={'name'}
                       id={'name'}
                       required={false}
                       placeholder={'only necessary with multiple shifts'}
                       onChange={inputChanged}
                       value={formData.get('name')}
                />
              </div>
            </div>

            <div className={'row mb-3'}>
              <label htmlFor={'description'}
                     className={'form-label mb-1 col-12'}>
                Description
              </label>
              <div className={'col-12'}>
                <input type={'text'}
                       className={'form-control'}
                       name={'description'}
                       id={'description'}
                       required={false}
                       placeholder={'only necessary with multiple shifts'}
                       onChange={inputChanged}
                       value={formData.get('description')}
                />
              </div>
            </div>

            <div className={'row mb-3'}>
              <label htmlFor={'capacity'} className={'form-label col-7'}>
                Capacity (bowlers)
              </label>
              <div className={'col-5'}>
                <input type={'number'}
                       min={1}
                       className={'form-control'}
                       name={'capacity'}
                       id={'capacity'}
                       required={true}
                       onChange={inputChanged}
                       value={formData.get('capacity')}
                />
              </div>
            </div>

            <div className={'row mb-3'}>
              <label htmlFor={'display_order'} className={'form-label col-7'}>
                Display Order
              </label>
              <div className={'col-5'}>
                <input type={'number'}
                       min={1}
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
                        className={'btn btn-outline-danger me-2'}>
                  <i className={'bi-x-lg'} aria-hidden={true}/>
                  <span className={'visually-hidden'}>
                    Cancel
                  </span>
                </button>
                <button type={'submit'}
                        title={'Save'}
                        disabled={!formData.get('valid')}
                        className={'btn btn-outline-success'}>
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
        <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mx-3'}
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
    </div>
  )
}

export default ShiftForm;
