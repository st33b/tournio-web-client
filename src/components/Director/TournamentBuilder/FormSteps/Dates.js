import {useState} from "react";

import {useDirectorContext} from "../../../../store/DirectorContext";

import classes from '../TournamentBuilder.module.scss';

const Dates = () => {
  const {directorState, dispatch} = useDirectorContext();

  const initialState = {
    fields: {
      start_date: '',
      end_date: '',
      entry_deadline: '',
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);

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

  return (
    <div>
      <h2>New Tournament: Dates</h2>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'start_date'}
               className={'col-12 col-md-3 col-form-label'}>
          Start Date
        </label>
        <div className={'col-5'}>
          <div className={'input-group'}>
            <input type={'date'}
                   className={'form-control'}
                   name={'start_date'}
                   id={'start_date'}
                   onChange={inputChanged}
                   value={formData.fields.start_date}
            />
            <span className={'input-group-text'}>
              <i className={'bi-calendar2-event'} aria-hidden={true}/>
            </span>
          </div>
        </div>
      </div>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'end_date'}
               className={'col-12 col-md-3 col-form-label'}>
          End Date
        </label>
        <div className={'col-5'}>
          <div className={'input-group'}>
            <input type={'date'}
                   className={'form-control'}
                   name={'end_date'}
                   id={'end_date'}
                   onChange={inputChanged}
                   value={formData.fields.end_date}
            />
            <span className={'input-group-text'}>
              <i className={'bi-calendar2-event'} aria-hidden={true}/>
            </span>
          </div>
        </div>
      </div>

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'entry_deadline'}
               className={'col-12 col-md-3 col-form-label'}>
          Entry Deadline
        </label>
        <div className={'col-7'}>
          <div className={'input-group'}>
            <input type={'datetime-local'}
                   className={'form-control'}
                   name={'entry_deadline'}
                   id={'entry_deadline'}
                   onChange={inputChanged}
                   value={formData.fields.entry_deadline}
            />
            <span className={'input-group-text'}>
              <i className={'bi-clock'} aria-hidden={true}/>
            </span>
          </div>
        </div>
      </div>

      <div className={`row ${classes.ButtonRow}`}>
        <div className={'col-12 d-flex justify-content-between'}>
          <button className={'btn btn-outline-secondary'}
                  role={'button'}
                  onClick={() => {}}>
            <i className={'bi-arrow-left pe-2'} aria-hidden={true}/>
            Previous
          </button>
          <button className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={() => {}}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dates;