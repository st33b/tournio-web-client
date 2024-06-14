import {Button} from "react-bootstrap";

import {useEffect, useState} from "react";

import classes from './ManualPayment.module.scss';

const ManualPayment = ({bowler, onSubmit, loading = false}) => {
  const initialFormState = {
    amount: '',
    identifier: '',

    valid: false,
  }

  const [formDisplayed, setFormDisplayed] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // Pre-populate the form with the amount that the bowler owes.
  useEffect(() => {
    if (!bowler) {
      return;
    }
    const newFormData = {...formData};
    newFormData.amount = bowler.amountDue;
    newFormData.valid = isFormValid(newFormData);
    setFormData(newFormData);
  }, [bowler]);

  const isFormValid = (data) => {
    return data.amount > 0;
  }

  const addClicked = () => {
    setFormDisplayed(true);
  }

  const cancelClicked = () => {
    setFormDisplayed(false);
  }

  const inputChanged = (event) => {
    const newValue = event.target.value;
    const newFormData = {...formData};
    newFormData[event.target.name] = newValue;
    newFormData.valid = isFormValid(newFormData);
    setFormData(newFormData);
  }

  const success = () => {
    setFormDisplayed(false);
    setFormData(initialFormState);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const ledgerEntry = {
      credit: formData.amount,
      identifier: formData.identifier,
    }
    onSubmit(ledgerEntry, success);
  }

  return (
    <div className={`${classes.ManualPayment}`}>
      {formDisplayed && (
        <form className={`${classes.Form} px-3 py-3`} onSubmit={formSubmitted}>
          <div className={`${classes.HeaderRow} row mb-2`}>
            <h6>
              New Ledger Entry
            </h6>
          </div>
          <div className={'row mb-3 mx-0'}>
            <label htmlFor={'amount'}
                   className={'form-label'}>
              Amount (in $)
            </label>
            <input type={'number'}
                   id={'amount'}
                   name={'amount'}
                   className={'form-control'}
                   min={0}
                   value={formData.amount}
                   onChange={inputChanged}/>
          </div>
          <div className={'row mb-3 mx-0'}>
            <label htmlFor={'identifier'}
                   className={'form-label'}>
              Identifier/Note (optional)
            </label>
            <input type={'text'}
                   id={'identifier'}
                   name={'identifier'}
                   className={'form-control'}
                   value={formData.identifier}
                   onChange={inputChanged}/>
          </div>
          <div className={'row mx-0'}>
            <div className={'d-flex justify-content-between p-0'}>
              <button type={'button'}
                      title={'Cancel'}
                      onClick={cancelClicked}
                      disabled={loading}
                      className={'btn btn-outline-danger'}>
                <i className={'bi-x-lg pe-2'} aria-hidden={true}/>
                Cancel
              </button>
              <button type={'submit'}
                      className={'btn btn-primary'}
                      disabled={!formData.valid || loading}>
                {loading && (
                  <span>
                    <span className={'spinner-border spinner-border-sm me-2'} role={'status'} aria-hidden={true}></span>
                  </span>
                )}
                Save
                <i className={'bi bi-chevron-right ps-2'} aria-hidden={true}/>
              </button>
            </div>
          </div>
        </form>
      )}
      {!formDisplayed && (
        <div className={'row my-3'}>
          <div className={'d-flex justify-content-center'}>
            <Button type={'button'}
                    variant={'outline-success'}
                    size={'sm'}
                    onClick={addClicked}>
              <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
              Add Manual Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManualPayment;
