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

  // No free entry form for tournaments with event selection. (At least, not yet.)
  if (commerce.tournament.config_items.some(({key, value}) => key === 'event_selection' && value)) {
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

  let serverMessage = '';
  if (commerce.freeEntry && commerce.freeEntry.message) {
    serverMessage = (
      <div className={'alert alert-success alert-dismissible fade show mt-3'} role={'alert'}>
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
      <div className={'alert alert-danger alert-dismissible fade show mt-3'} role={'alert'}>
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
    <a href={'#'} className={textClass} onClick={linkClicked}>
      I have a free entry
    </a>
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
      <form onSubmit={formHandler} className={formClass}>
        <div className={'row mb-0'}>
          <label className={'col-12 col-form-label col-form-label-lg pb-1'} htmlFor={'free_entry_code'}>
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

        <div className={'text-end pt-2'}>
          <button className={'btn btn-primary'} type={'submit'} disabled={!freeEntryForm.valid}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default FreeEntryForm;