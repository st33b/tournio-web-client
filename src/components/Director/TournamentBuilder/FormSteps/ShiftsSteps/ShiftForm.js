import React, {useEffect, useState} from "react";

import classes from '../../TournamentBuilder.module.scss';

const ShiftForm = ({shift, allEvents, onShiftUpdated, withDetails, onShiftDeleted}) => {
  const areAllValid = (fields) => {
    return fields.capacity.value > 0
      && fields.display_order.value > 0
      && (!withDetails || fields.name.value.length > 0);
  }

  const initialFormData = {
    fields: {
      event_ids: {
        value: [],
        valid: false,
        validation: {
          required: true,
        },
        validityErrors: [
          'valueMissing',
        ],
        validated: false,
        touched: false,
      },
      name: {
        value: '',
        valid: false,
        validation: {
          required: true,
        },
        validityErrors: [
          'valueMissing',
          'tooShort'
        ],
        validated: false,
        touched: false,
      },
      description: {
        value: '',
        valid: true,
      },
      capacity: {
        value: '',
        valid: false,
        validation: {
          required: true,
          min: 1,
        },
        validityErrors: [
          'valueMissing',
          'rangeUnderflow'
        ],
        validated: false,
        touched: false,
      },
      display_order: {
        value: 1,
        valid: true,
        validation: {
          required: true,
          min: 1,
        },
        validityErrors: [
          'valueMissing',
          'rangeUnderflow'
        ],
        validated: false,
        touched: false,
      },
    },
    valid: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Populate form data with the shift prop
  useEffect(() => {
    if (!shift) {
      return;
    }
    const newFormData = {...formData};
    newFormData.fields.event_ids.value = shift.event_ids;
    newFormData.fields.name.value = shift.name;
    newFormData.fields.description.value = shift.description;
    newFormData.fields.capacity.value = shift.capacity;
    newFormData.fields.display_order.value = shift.display_order;
    newFormData.valid = areAllValid(newFormData.fields);

    setFormData(newFormData);
  }, [shift]);

  const inputChanged = (event) => {
    let newValue = '';
    let inputName = event.target.name;
    switch (inputName) {
      case 'capacity':
      case 'display_order':
        if (event.target.value.length === 0) {
          newValue = '';
        } else {
          newValue = parseInt(event.target.value);
        }
        break;
      case 'name':
      case 'description':
        newValue = event.target.value;
        break;
      case 'event_ids':
        const eventId = parseInt(event.target.value);
        const selected = event.target.checked;
        if (selected) {
          newValue = formData.fields.event_ids.value.concat([eventId]);
        } else {
          newValue = formData.fields.event_ids.value.filter(id => id !== eventId);
        }
        break;
      default:
        break;
    }
    const newFormData = {...formData};
    newFormData.fields[inputName].value = newValue;
    newFormData.valid = areAllValid(newFormData.fields);
    newFormData.fields[inputName].touched = true;
    setFormData(newFormData);

    if (onShiftUpdated) {
      const updatedShift = {};
      Object.keys(newFormData.fields).forEach(key => {
        updatedShift[key] = newFormData.fields[key].value;
      });
      onShiftUpdated(updatedShift);
    }
  }

  const fieldBlurred = (event) => {
    const {validity, name} = event.target;

    const checksToRun = formData.fields[name].validityErrors;
    if (!checksToRun) {
      return;
    }
    const looksGood = checksToRun.every(check => !validity[check]);

    const newFormData = {...formData}
    newFormData.fields[name].valid = looksGood;
    newFormData.fields[name].validated = true;
    setFormData(newFormData);
  }

  return (
    <div className={classes.Shift}>
      <form noValidate={true}>
        {onShiftDeleted && (
          <div className={'position-relative'}>
            <button type={'button'}
                    title={'Delete'}
                    onClick={onShiftDeleted}
                    className={`${classes.DeleteButton} btn btn-sm text-danger fs-3 px-0 pt-0 position-absolute top-0 end-0`}>
              <i className={'bi-x-circle'} aria-hidden={true}/>
              <span className={'visually-hidden'}>
              Delete
            </span>
            </button>
          </div>
        )}

        {withDetails && allEvents && (
          <div className={`row ${classes.FieldRow}`}>
            <label htmlFor={'name'}
                   className={'col-form-label mb-1 col-12 col-sm-3'}>
              Events in Shift
              <div className="d-inline">
                <i className={`${classes.RequiredLabel} align-top bi-asterisk`}/>
                <span className="visually-hidden">
                  The shift needs events.
                </span>
              </div>

            </label>
            <div className={`col col-sm-8 ${formData.fields.event_ids.touched ? 'was-validated' : ''}`}>
              {allEvents.map(e => (
                <div className={'form-check'} key={e.id}>
                    <input className="form-check-input"
                           type="checkbox"
                           value={e.id}
                           name={`event_ids`}
                           onChange={inputChanged}
                           id={`check-${e.id}`}/>
                    <label className="form-check-label"
                           htmlFor={`check-{${e.id}`}>
                      {e.name}
                    </label>
                </div>
              ))}
              <div className="invalid-feedback">
                <div>
                  <i className="bi-x" aria-hidden="true"/>
                  <span className={classes.InvalidFeedback}>
                    The shift needs events.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {withDetails && (
          <div className={`row ${classes.FieldRow}`}>
            <label htmlFor={'name'}
                   className={'col-form-label mb-1 col-12 col-sm-3'}>
              Name
              <div className="d-inline">
                <i className={`${classes.RequiredLabel} align-top bi-asterisk`}/>
                <span className="visually-hidden">
                  The shift needs a name.
                </span>
              </div>

            </label>
            <div className={`col col-sm-8 ${formData.fields.name.touched ? 'was-validated' : ''}`}>
              <input type={'text'}
                     className={'form-control'}
                     name={'name'}
                     id={'name'}
                     required={true}
                     minLength={1}
                     onChange={inputChanged}
                     onBlur={fieldBlurred}
                     value={formData.fields.name.value}
              />
              <div className="invalid-feedback">
                <div>
                  <i className="bi-x" aria-hidden="true"/>
                  <span className={classes.InvalidFeedback}>
                    The shift needs a name.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {withDetails && (
          <div className={`row ${classes.FieldRow}`}>
            <label htmlFor={'description'}
                   className={'col-form-label mb-1 col-12 col-sm-3'}>
              Description
            </label>
            <div className={'col col-sm-8'}>
              <input type={'text'}
                     className={'form-control'}
                     name={'description'}
                     id={'description'}
                     required={false}
                     onChange={inputChanged}
                     value={formData.fields.description.value}
              />
            </div>
          </div>
        )}

        <div className={`row ${classes.FieldRow}`}>
          <label htmlFor={'capacity'} className={'col-form-label col-7 col-sm-3'}>
            Capacity
            <div className="d-inline">
              <i className={`${classes.RequiredLabel} align-top bi-asterisk`}/>
              <span className="visually-hidden">
                Capacity is required.
              </span>
            </div>
          </label>
          <div className={`col col-sm-3 ${formData.fields.capacity.touched && formData.fields.capacity.validated ? 'was-validated' : ''}`}>
            <input type={'number'}
                   min={1}
                   className={'form-control'}
                   name={'capacity'}
                   id={'capacity'}
                   required={true}
                   onChange={inputChanged}
                   onBlur={fieldBlurred}
                   value={formData.fields.capacity.value}
            />
            <div className="invalid-feedback">
              <div>
                <i className="bi-x" aria-hidden="true"/>
                <span className={classes.InvalidFeedback}>
                  Must be a positive number.
                </span>
              </div>
            </div>
          </div>
        </div>

        {withDetails && (
          <div className={`row ${classes.FieldRow}`}>
            <label htmlFor={'display_order'} className={'col-form-label col-7 col-sm-3'}>
              Display Order
            </label>
            <div className={`col col-sm-3 ${formData.fields.display_order.touched && formData.fields.display_order.validated ? 'was-validated' : ''}`}>
              <input type={'number'}
                     min={1}
                     className={'form-control'}
                     name={'display_order'}
                     id={'display_order'}
                     required={true}
                     onChange={inputChanged}
                     onBlur={fieldBlurred}
                     value={formData.fields.display_order.value}
              />
              <div className="invalid-feedback">
                <div>
                  <i className="bi-x" aria-hidden="true"/>
                  <span className={classes.InvalidFeedback}>
                  Must be a positive number.
                </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default ShiftForm;
