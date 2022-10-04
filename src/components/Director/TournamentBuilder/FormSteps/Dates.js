import {useEffect, useRef, useState} from "react";

import {useDirectorContext} from "../../../../store/DirectorContext";

import classes from '../TournamentBuilder.module.scss';
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";
import {directorApiRequest} from "../../../../director";
import {devConsoleLog} from "../../../../utils";

const Dates = () => {
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const initialState = {
    fields: {
      start_date: '',
      end_date: '',
      entry_deadline: '',
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  useEffect(() => {
    if (!directorState || !directorState.builder) {
      return;
    }
    if (directorState.builder.tournament) {
      // We might have returned to this page after advancing.
      const newFormData = {...formData};
      newFormData.fields.start_date = directorState.builder.tournament.start_date || '';
      newFormData.fields.end_date = directorState.builder.tournament.end_date || '';
      newFormData.fields.entry_deadline = directorState.builder.tournament.entry_deadline || '';
      newFormData.valid = isValid(newFormData.fields);
      setFormData(newFormData);
    }
  }, [directorState, directorState.builder])

  const isValid = (fields) => {
    const allHaveValues = fields.start_date.length > 0 &&
      fields.end_date.length > 0 &&
      fields.entry_deadline.length > 0;

    if (!allHaveValues) {
      return false;
    }

    // They're all in the future
    const startDate = new Date(fields.start_date);
    const startValue = startDate.valueOf();
    const endDate = new Date(fields.end_date);
    const endValue = endDate.valueOf();
    const deadlineDate = new Date(fields.entry_deadline);
    const deadlineValue = deadlineDate.valueOf();
    const rightNow = (new Date()).valueOf();

    const allInFuture = rightNow < startValue &&
      rightNow < endValue &&
      rightNow < deadlineValue;

    if (!allInFuture) {
      return false;
    }

    // They make sense with respect to each other
    const startBeforeEnd = startValue <= endValue;
    const deadlineBeforeEnd = deadlineValue <= endValue;

    return startBeforeEnd && deadlineBeforeEnd;
  }

  const inputChanged = (event) => {
    const changedData = {...formData};
    const newValue = event.target.value;
    const fieldName = event.target.name;
    changedData.fields[fieldName] = newValue;
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const saveSuccess = (data) => {
    // put the updated tournament into context, and set the next step
    dispatch(newTournamentSaved(data));
    dispatch(newTournamentStepCompleted('dates', 'logo'));
  }

  const nextClicked = () => {
    const identifier = directorState.builder.tournament.identifier;
    const uri = `/director/tournaments/${identifier}`;
    const requestConfig = {
      method: 'patch',
      data: {
        tournament: {
          start_date: formData.fields.start_date,
          end_date: formData.fields.end_date,
          entry_deadline: formData.fields.entry_deadline,
        },
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: saveSuccess,
      onFailure: (err) => devConsoleLog("Failed to update tournament.", err),
    });
  }

  const startDateElement = useRef(null);
  const endDateElement = useRef(null);
  const deadlineElement = useRef(null);

  return (
    <div>
      <h2>New Tournament: Dates</h2>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'start_date'}
               className={'col-12 col-md-3 col-form-label'}>
          Start Date
        </label>
        <div className={'col-8 col-md-5'}>
          <div className={'input-group'}>
            <input type={'date'}
                   className={'form-control'}
                   name={'start_date'}
                   id={'start_date'}
                   ref={startDateElement}
                   onChange={inputChanged}
                   value={formData.fields.start_date}
            />
            <button className={`btn ${classes.DateTimeButton}`}
                    type={'button'}
                    role={'button'}
                    onClick={() => startDateElement.current.focus()}>
              <i className={'bi-calendar2-event'} aria-hidden={true}/>
            </button>
          </div>
        </div>
      </div>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'end_date'}
               className={'col-12 col-md-3 col-form-label'}>
          End Date
        </label>
        <div className={'col-8 col-md-5'}>
          <div className={'input-group'}>
            <input type={'date'}
                   className={'form-control'}
                   name={'end_date'}
                   id={'end_date'}
                   ref={endDateElement}
                   onChange={inputChanged}
                   value={formData.fields.end_date}
            />
            <button className={`btn ${classes.DateTimeButton}`}
                    type={'button'}
                    role={'button'}
                    onClick={() => endDateElement.current.focus()}>
              <i className={'bi-calendar2-event'} aria-hidden={true}/>
            </button>
          </div>
        </div>
      </div>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'entry_deadline'}
               className={'col-12 col-md-3 col-form-label'}>
          Entry Deadline
        </label>
        <div className={'col col-md-7'}>
          <div className={'input-group'}>
            <input type={'datetime-local'}
                   className={'form-control'}
                   name={'entry_deadline'}
                   id={'entry_deadline'}
                   ref={deadlineElement}
                   onChange={inputChanged}
                   value={formData.fields.entry_deadline}
            />
            <button className={`btn ${classes.DateTimeButton}`}
                    type={'button'}
                    role={'button'}
                    onClick={() => deadlineElement.current.focus()}>
              <i className={'bi-clock'} aria-hidden={true}/>
            </button>
          </div>
        </div>
      </div>

      <div className={`row ${classes.ButtonRow}`}>
        <div className={'col-12 d-flex justify-content-end'}>
          <button className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={nextClicked}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dates;