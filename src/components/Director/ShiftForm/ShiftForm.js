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
      onSuccess: addShiftSuccess,
      onFailure: (data) => console.log("D'oh!", data),
    });
  }

  const addShiftSuccess = (data) => {
    context.dispatch(tournamentShiftAdded(data));
    setSuccessMessage('Shift added.');
    setFormDisplayed(false);
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
    if (shift.paid_count === shift.capacity) {
      colorClass = classes.Full;
    } else if (shift.paid_count + shift.unpaid_count + 16 >= shift.capacity) {
      colorClass = classes.AlmostFull;
    }
  }

  let [dtClass, ddClass] = ['col-6', 'col-6'];
  if (['setup', 'testing'].includes(tournament.state)) {
    [dtClass, ddClass] = ['col-5', 'col-7'];
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
          <dl className={`${classes.ExistingShift} p-1`}>
            <div className={'row'}>
              <dt className={dtClass}>
                Name
              </dt>
              <dd className={ddClass}>
                {shift.name || 'n/a'}
              </dd>
              <dt className={dtClass}>
                Description
              </dt>
              <dd className={ddClass}>
                {shift.description || 'n/a'}
              </dd>
            </div>

            <div className={`row ${colorClass}`}>
              <dt className={dtClass}>
                Capacity
              </dt>
              <dd className={ddClass}>
                {shift.capacity} bowlers
              </dd>
              <dt className={dtClass}>
                Paid
              </dt>
              <dd className={ddClass}>
                {shift.paid_count}
              </dd>
              <dt className={dtClass}>
                Unpaid
              </dt>
              <dd className={ddClass}>
                {shift.unpaid_count}
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
                        className={'btn btn-secondary me-2'}>
                    Cancel
                </button>
                <button type={'submit'}
                        title={'Save'}
                        disabled={!formData.get('valid')}
                        className={'btn btn-primary'}>
                    Save
                </button>
              </div>
            </div>
          </form>
        </Card.Body>
      }
    </div>
  )
}

export default ShiftForm;
