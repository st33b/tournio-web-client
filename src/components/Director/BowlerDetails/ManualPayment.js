import {Button} from "react-bootstrap";

import {useEffect, useState} from "react";

import classes from './ManualPayment.module.scss';

const ManualPayment = ({bowler, onSubmit, loading = false}) => {
  const initialFormState = {
    amount: '',
    identifier: '',
    purchases: [],

    valid: false,
  }

  const [formDisplayed, setFormDisplayed] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // Pre-populate the form with the amount that the bowler owes and their unpaid purchases
  useEffect(() => {
    if (!bowler) {
      return;
    }
    const newFormData = {...formData};
    newFormData.amount = bowler.amount_due;

    newFormData.purchases = bowler.purchases.filter(purchase => purchase.paid_at === null).map(purchase => (
      {
        identifier: purchase.identifier,
        name: purchase.name,
        amount: ['early_discount', 'bundle_discount'].includes(purchase.determination) ? -purchase.value : purchase.value,
        applied: true,
      }
    ));

    newFormData.valid = isFormValid(newFormData);
    setFormData(newFormData);
  }, [bowler]);

  const appliedAmount = (data) => data.purchases.reduce((runningTotal, purchase) => (
    purchase.applied ? runningTotal + purchase.amount : runningTotal
  ), 0);

  const isFormValid = (data) => {
    const amountApplied = appliedAmount(data);
    const addsUp = amountApplied === 0 || amountApplied == data.amount;
    return data.amount > 0 && addsUp;
  }

  const addClicked = () => {
    setFormDisplayed(true);
  }

  const cancelClicked = () => {
    setFormDisplayed(false);
  }

  const inputChanged = (event) => {
    const newFormData = {...formData};
    const nameParts = event.target.name.split('.');
    if (nameParts[0] === 'applyTo') {
      const index = newFormData.purchases.findIndex(({identifier}) => identifier === nameParts[1]);
      newFormData.purchases[index].applied = event.target.checked;
    } else {
      newFormData[event.target.name] = event.target.value;
    }
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
            <label htmlFor={'link_to_purchases'}
                   className={'form-label'}>
              (optional) Apply it to:
            </label>
            <div>
              {formData.purchases.map((p) => (
                <div className={'form-check'} key={p.identifier}>
                  <input className={'form-check-input'}
                         type={'checkbox'}
                         checked={p.applied}
                         onChange={inputChanged}
                         name={`applyTo.${p.identifier}`}
                         id={`apply_to_${p.identifier}`} />
                  <label className={'form-check-label'}
                         htmlFor={`apply_to_${p.identifier}`}>
                    {p.name} ({p.amount < 0 && '-'}${Math.abs(p.amount)})
                  </label>
                </div>
              ))}
            </div>
            <p className={classes.AmountApplied}>
              <span>Amount applied: ${appliedAmount(formData)}</span>
            </p>
          </div>
          <div className={'row mb-3 mx-0'}>
            <label htmlFor={'identifier'}
                   className={'form-label'}>
              (optional) Note
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
