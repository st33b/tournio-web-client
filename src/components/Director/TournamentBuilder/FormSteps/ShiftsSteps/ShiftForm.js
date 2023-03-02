import {useEffect, useState} from "react";
import Card from 'react-bootstrap/Card';

import classes from '../../TournamentBuilder.module.scss';

const ShiftForm = ({shift, onShiftUpdated, withDetails, onShiftDeleted}) => {
  const isValid = (fields) => {
    return fields.capacity > 0
      && fields.display_order > 0
      && (!withDetails || fields.name.length > 0);
  }

  const initialFormData = {
    fields: {
      name: '',
      description: '',
      capacity: 0,
      display_order: 1,
    },

    valid: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Populate form data with the shift prop
  useEffect(() => {
    if (!shift) {
      return;
    }
    const newFormData = {
      fields: {
        name: shift.name,
        description: shift.description,
        capacity: shift.capacity,
        display_order: shift.display_order,
      },
    };
    newFormData.valid = isValid(newFormData.fields);

    setFormData(newFormData);
  }, [shift]);

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
    const newFormData = {...formData};
    newFormData.fields[inputName] = newValue;
    newFormData.valid = isValid(newFormData.fields);
    setFormData(newFormData);
    onShiftUpdated(newFormData.fields);
  }

  return (
    <div className={classes.Shift}>
      {onShiftDeleted && (
        <div className={'position-relative'}>
        <button type={'button'}
                title={'Delete'}
                onClick={onShiftDeleted}
                className={'btn btn-sm text-danger fs-3 px-0 position-absolute top-0 end-0'}>
          <i className={'bi-x-circle'} aria-hidden={true}/>
          <span className={'visually-hidden'}>
            Delete
          </span>
        </button>
        </div>
      )}

      {withDetails && (
        <div className={`row ${classes.FieldRow}`}>
          <label htmlFor={'name'}
                 className={'col-form-label mb-1 col-12 col-sm-3'}>
            Name
          </label>
          <div className={'col col-sm-8'}>
            <input type={'text'}
                   className={'form-control'}
                   name={'name'}
                   id={'name'}
                   required={false}
                   onChange={inputChanged}
                   value={formData.fields.name}
            />
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
                   value={formData.fields.description}
            />
          </div>
        </div>
      )}

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'capacity'} className={'col-form-label col-7 col-sm-3'}>
          Capacity (bowlers)
        </label>
        <div className={'col col-sm-3'}>
          <input type={'number'}
                 min={1}
                 className={'form-control'}
                 name={'capacity'}
                 id={'capacity'}
                 required={true}
                 onChange={inputChanged}
                 value={formData.fields.capacity}
          />
        </div>
      </div>

      {withDetails && (
        <div className={`row ${classes.FieldRow}`}>
          <label htmlFor={'display_order'} className={'col-form-label col-7 col-sm-3'}>
            Display Order
          </label>
          <div className={'col col-sm-3'}>
            <input type={'number'}
                   min={1}
                   className={'form-control'}
                   name={'display_order'}
                   id={'display_order'}
                   required={true}
                   onChange={inputChanged}
                   value={formData.fields.display_order}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default ShiftForm;
