import {useEffect, useState} from "react";
import {Map} from "immutable";
import Card from 'react-bootstrap/Card';

import {directorApiRequest, useTournament} from "../../../director";

import classes from './ShiftForm.module.scss';
import ButtonRow from "../../common/ButtonRow";
import {useLoginContext} from "../../../store/LoginContext";
import {updateObject} from "../../../utils";
import ErrorAlert from "../../common/ErrorAlert";

const ShiftForm = ({shift}) => {
  const {loading, tournament, tournamentUpdatedQuietly} = useTournament();
  const { authToken } = useLoginContext();

  const ALMOST_FULL_THRESHOLD = 4;

  const initialFormData = Map({
    name: '',
    description: '',
    capacity: 0,
    display_order: 1,
    is_full: false,

    valid: false,
  });

  const [formData, setFormData] = useState(initialFormData);
  const [formDisplayed, setFormDisplayed] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

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
      is_full: shift.is_full,

      valid: true,
    };

    setFormData(Map(existingShift));
  }, [shift]);

  if (loading) {
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
      case 'is_full':
        newValue = event.target.checked;
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

    const uri = `/tournaments/${tournament.identifier}/shifts`;
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
      authToken: authToken,
      onSuccess: addShiftSuccess,
      onFailure: (err) => {
        setErrorMessage(err.message)
      },
    });
  }

  const addShiftSuccess = (data) => {
    setFormDisplayed(false);
    const updatedTournament = updateObject(tournament, {
      shifts: tournament.shifts.concat(data),
    });
    setFormData(initialFormData);
    tournamentUpdatedQuietly(updatedTournament);
  }

  const toggleEdit = (event) => {
    event.preventDefault();
    setFormDisplayed(!formDisplayed);
  }

  const shiftDeleteSuccess = () => {
    const updatedTournament = updateObject(tournament, {
      shifts: tournament.shifts.filter(({identifier}) => identifier !== shift.identifier),
    });
    tournamentUpdatedQuietly(updatedTournament);
  }

  const deleteShift = (event) => {
    event.preventDefault();
    if (!allowDelete) {
      return;
    }
    const uri = `/shifts/${shift.identifier}`;
    const requestConfig = {
      method: 'delete',
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: shiftDeleteSuccess,
      onFailure: (err) => {
        setErrorMessage(err.message)
      },
    });
  }

  const updateShiftFormSubmitted = (event) => {
    event.preventDefault();

    const uri = `/shifts/${shift.identifier}`;
    const requestConfig = {
      method: 'patch',
      data: {
        shift: {
          capacity: formData.get('capacity'),
          name: formData.get('name'),
          description: formData.get('description'),
          display_order: formData.get('display_order'),
          is_full: formData.get('is_full'),
        },
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: updateShiftSuccess,
      onFailure: (err) => {
        setErrorMessage(err.message)
      },
    });
  }

  const updateShiftSuccess = (data) => {
    const shifts = [...tournament.shifts];
    const index = shifts.findIndex(({identifier}) => identifier === shift.identifier);
    shifts[index] = {...data};
    const updatedTournament = updateObject(tournament, {
      shifts: shifts,
    });

    tournamentUpdatedQuietly(updatedTournament);
    setFormDisplayed(false);
  }

  let submitFunction = addShiftFormSubmitted;
  let colorClass = '';
  if (shift) {
    submitFunction = updateShiftFormSubmitted;
    if (shift.requested === shift.capacity) {
      colorClass = classes.Full;
    } else if (shift.capacity - shift.requested <= ALMOST_FULL_THRESHOLD) {
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
                {shift.capacity} teams
              </dd>
              <dt className={dtClass}>
                Requested
              </dt>
              <dd className={ddClass}>
                {shift.requested}
              </dd>
                <dt className={dtClass}>
                    Marked as Full?
                </dt>
                <dd className={ddClass}>
                    {shift.is_full ? 'Yes' : 'No'}
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

              <div className={'row mb-3'}>
                  <label htmlFor={'is_full'} className={'form-label col-7'}>
                      Mark as Full?
                  </label>
                  <div className={'col-5'}>
                      <div className={'col-5 form-check form-switch'}>
                          <input type={'checkbox'}
                                 className={'form-check-input'}
                                 role={'switch'}
                                 id={`is_full`}
                                 name={`is_full`}
                                 checked={formData.get('is_full')}
                                 onChange={inputChanged} />
                      </div>
                  </div>
              </div>

            <div className={'row'}>
              <ButtonRow onCancel={formCancelled}
                         disableSave={!formData.get('valid')}
                         onDelete={allowDelete ? deleteShift : false} />
            </div>
            <ErrorAlert message={errorMessage}
                        className={`mt-3 mb-0`}
                        onClose={() => setErrorMessage(null)}
                        />
          </form>
        </Card.Body>
      }
    </div>
  )
}

export default ShiftForm;
