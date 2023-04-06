import {useState} from "react";

import {useCommerceContext} from "../../../store/CommerceContext";
import {postFreeEntry, updateObject} from "../../../utils";
import {freeEntryDeclared, freeEntryFailure, freeEntrySuccess} from "../../../store/actions/registrationActions";

import classes from './FreeEntryForm.module.scss';

const FreeEntryForm = () => {
  const {commerce, dispatch} = useCommerceContext();

  let initialCode = '';
  if (commerce.freeEntry && commerce.freeEntry.code) {
    initialCode = commerce.freeEntry.code;
  }

  const initialState = {
    freeEntryCode: initialCode,
    valid: false,
    display: false,
  }

  const [freeEntryForm, setFreeEntryForm] = useState(initialState);

  if (!commerce || !commerce.bowler) {
    return '';
  }

  const onFreeEntryPostSuccess = (data) => {
    dispatch(freeEntrySuccess(data.unique_code, data.message));
  }

  const onFreeEntryPostFailure = (data) => {
    dispatch(freeEntryFailure(freeEntryForm.freeEntryCode, data.error));
  }

  const freeEntryCompleted = () => {
    if (!freeEntryForm.freeEntryCode || !freeEntryForm.valid) {
      return;
    }

    const tournamentIdentifier = commerce.tournament.identifier;
    const postData = {
      unique_code: freeEntryForm.freeEntryCode,
      bowler_identifier: commerce.bowler.identifier,
    };
    postFreeEntry(tournamentIdentifier, postData, onFreeEntryPostSuccess, onFreeEntryPostFailure);
  }

  const formHandler = (event) => {
    event.preventDefault();

    if (!freeEntryForm.valid) {
      return;
    }

    freeEntryCompleted();
  }

  const isValid = (value) => {
    return value.trim().length > 0;
  }

  const inputChangedHandler = (event) => {
    const enteredCode = event.target.value;
    const newState = updateObject(freeEntryForm, {
      freeEntryCode: enteredCode,
      valid: isValid(enteredCode),
    });
    setFreeEntryForm(newState);
  }

  let textClass = 'd-block';
  let formClass = 'd-none';
  if (freeEntryForm.display) {
    textClass = 'd-none';
    formClass = 'd-block';
  }

  const linkClicked = (event) => {
    event.preventDefault();
    const newState = updateObject(freeEntryForm, {
      display: true,
    });
    setFreeEntryForm(newState);
    dispatch(freeEntryDeclared());
  }

  const cancelClicked = (event) => {
    event.preventDefault();
    const newState = updateObject(freeEntryForm, {
      display: false,
    });
    setFreeEntryForm(newState);
  }

  let serverMessage = '';
  if (commerce.freeEntry && commerce.freeEntry.message) {
    serverMessage = (
      <div className={`alert alert-success alert-dismissible fade show ${classes.Alert}`} role={'alert'}>
        {commerce.freeEntry.message}
        <button type={'button'} className={'btn-close'} data-bs-dismiss={'alert'} aria-label={'Close'} />
      </div>
    );
    formClass = 'd-none';
    textClass = 'd-none';
  }

  let errorMessage = '';
  if (commerce.freeEntry && commerce.freeEntry.error) {
    errorMessage = (
      <div className={`alert alert-danger alert-dismissible fade show ${classes.Alert}`} role={'alert'}>
        {commerce.freeEntry.error}
        <button type={'button'} className={'btn-close'} data-bs-dismiss={'alert'} aria-label={'Close'} />
      </div>
    );
  }

  let appliedCode = '';
  if (commerce.bowler.free_entry_code) {
    appliedCode = (
      <div className={classes.AppliedCode}>
        Free entry code applied:
        <strong>
          {commerce.bowler.free_entry_code}
        </strong>
      </div>
    );
  }

  let declareLink = (
    <div className={`${textClass}`}>
      <a href={'#'}
         className={`btn btn-primary`}
         onClick={linkClicked}>
        I have a free entry
      </a>
    </div>
  );

  // Hide the link if they have a free entry, confirmed or not
  if (commerce.bowler.has_free_entry) {
    declareLink = '';
  }

  return (
    <div className={classes.FreeEntryForm}>
      {appliedCode}
      {declareLink}
      {serverMessage}
      {errorMessage}
      <form onSubmit={formHandler} className={`${formClass} ${classes.CodeForm}`}>
        <div className={'row mb-0'}>
          <label className={`${classes.FormLabel} col-12 col-form-label col-form-label`}
                 htmlFor={'free_entry_code'}>
            Free Entry Code
          </label>
          <div className={'col-12'}>
            <input type={'text'}
                   name={'free_entry_code'}
                   id={'free_entry_code'}
                   maxLength={25}
                   className={'form-control'}
                   value={freeEntryForm.freeEntryCode}
                   onChange={(event) => inputChangedHandler(event)} />
          </div>
        </div>

        <div className={classes.ActionRow}>
          <button className={'btn btn-outline-dark btn-sm me-3'} type={'button'} onClick={cancelClicked}>
            Cancel
          </button>
          <button className={'btn btn-primary btn-sm'} type={'submit'} disabled={!freeEntryForm.valid}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default FreeEntryForm;
