import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Map} from "immutable";
import Card from 'react-bootstrap/Card';

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './ShiftForm.module.scss';

const ShiftForm = () => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialFormData = Map({
    name: '',
    description: '',
    capacity: 0,
    display_order: 1,
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

  const formSubmitted = (event) => {
    event.preventDefault();

  }

  const inputChanged = (event) => {

  }

  return (
    <div className={`${classes.ShiftForm}`}>
      <Card.Body>
        {formDisplayed &&
          <form onSubmit={formSubmitted}>
            <div className={'row mb-3'}>
              <label htmlFor={'name'}
                     className={'form-label ps-0 mb-1'}>
                Name
              </label>
              <input type={'text'}
                     className={'form-control'}
                     name={'name'}
                     id={'name'}
                     required={true}
                     onChange={inputChanged}
                     value={formData.get('name')}
                     />
            </div>
            <div className={'row mb-3'}>
              <label htmlFor={'description'}
                     className={'form-label ps-0 mb-1'}>
                Description
              </label>
              <input type={'text'}
                     className={'form-control'}
                     name={'description'}
                     id={'description'}
                     required={true}
                     onChange={inputChanged}
                     value={formData.get('description')}
              />
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
        {successMessage}
        {errorMessage}
      </Card.Body>
    </div>
  )
}

export default ShiftForm;