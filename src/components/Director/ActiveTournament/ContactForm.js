import {useEffect, useState} from "react";

import classes from './ActiveTournament.module.scss';
import {devConsoleLog} from "../../../utils";
import EditButton from "./EditButton";
import ErrorAlert from "../../common/ErrorAlert";

const ContactForm = ({contact, onSubmit, onDelete, newContact = false}) => {
  const initialState = {
    identifier: '',
    name: '',
    role: '',
    email: '',
    notifyOnRegistration: false,
    notifyOnPayment: false,
    notificationPreference: 'daily_summary',

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (contact) {
      setFormData({
        ...contact,
        valid: true,
      });
    }
  }, [contact, newContact]);

  const isValid = (data) => {
    return data.name.length > 0
      && data.role.length > 0
      && ['daily_summary', 'individually'].includes(data.notificationPreference);
  }

  const inputChanged = (event) => {
    const newFormData = {...formData};
    if (event.target.name === 'notifyOnPayment' || event.target.name === 'notifyOnRegistration') {
      newFormData[event.target.name] = event.target.checked;
    } else {
      newFormData[event.target.name] = event.target.value;
    }
    newFormData.valid = isValid(newFormData);
    setFormData(newFormData)
  }

  const onSuccess = () => {
    setEditing(false);
    setFormData({...initialState});
  }

  const onFailure = (error) => {
    devConsoleLog(error);
    setErrorMessage(error);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    onSubmit(formData, onSuccess, onFailure);
  }

  const editClicked = () => {
    setEditing(true);
  }

  const deleteClicked = (event) => {
    event.preventDefault();
    if (confirm('Are you sure you wish to delete this contact?')) {
      onDelete(contact, onSuccess, onFailure);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////

  const roles = {
    'co-director': 'Co-Director',
    'director': 'Director',
    'fundraising': 'Fundraising',
    'secretary': 'Secretary',
    'secretary-treasurer': 'Secretary/Treasurer',
    'statistician': 'Statistician',
    'treasurer': 'Treasurer',
    'registration': 'Registration',
    'igbo-representative': 'IGBO Representative',
    'technologist': 'Technologist',
    'member-at-large': 'Member At Large',
    'operations': 'Director of Operations',
  };

  const preferenceLabels = {
    daily_summary: 'Daily Summary',
    individually: 'Individually',
  }

  const chosenNotifications = [];
  if (formData.notifyOnPayment) {
    chosenNotifications.push('payments');
  }
  if (formData.notifyOnRegistration) {
    chosenNotifications.push('registrations');
  }

  return (
    <div className={classes.ContactForm}>
      {editing &&
        <form onSubmit={formSubmitted}>
          <div className={classes.ContactFormInput}>
            <label className={'form-label mb-1'}>
              Name
            </label>
            <input type={'text'}
                   className={'form-control'}
                   required={true}
                   onChange={inputChanged}
                   name={'name'}
                   value={formData.name}/>
          </div>
          <div className={classes.ContactFormInput}>
            <label className={'form-label mb-1'}>
              Email Address
            </label>
            <input type={'email'}
                   className={'form-control'}
                   onChange={inputChanged}
                   name={'email'}
                   value={formData.email}/>
          </div>
          <div className={classes.ContactFormInput}>
            <label className={'form-label mb-1'}>
              Role
            </label>
            <select className={'form-select'}
                    name={'role'}
                    onChange={inputChanged}
                    value={formData.role || ''}>
              <option value={''}>--</option>
              {Object.entries(roles).map(pair => <option value={pair[0]} key={pair[0]}>{pair[1]}</option>)}
            </select>
          </div>
          <div className={classes.ContactFormInput}>
            <label className={'form-label ps-0 mb-1'}>
              Notifications to receive
            </label>
            <div className={'form-check form-switch ms-3'}>
              <input type={'checkbox'}
                     className={'form-check-input'}
                     role={'switch'}
                     name={'notifyOnPayment'}
                     id={'notifyOnPayment'}
                     onChange={inputChanged}
                     checked={formData.notifyOnPayment}/>
              <label className={'form-check-label'}
                     htmlFor={'notifyOnPayment'}>
                Payment received
              </label>
            </div>
            <div className={'form-check form-switch ms-3'}>
              <input type={'checkbox'}
                     className={'form-check-input'}
                     role={'switch'}
                     name={'notifyOnRegistration'}
                     id={'notifyOnRegistration'}
                     onChange={inputChanged}
                     checked={formData.notifyOnRegistration}/>
              <label className={'form-check-label'}
                     htmlFor={'notifyOnRegistration'}>
                Registration received
              </label>
            </div>
          </div>
          <div className={classes.ContactFormInput}>
            <label className={'form-label ps-0 mb-1'}>
              Notification Frequency
            </label>
            <div className={'form-check ms-3'}>
              <input type={'radio'}
                     className={'form-check-input'}
                     name={'notificationPreference'}
                     id={'notification_preference_daily_summary'}
                     disabled={chosenNotifications.length === 0}
                     onChange={inputChanged}
                     value={'daily_summary'}
                     checked={formData.notificationPreference === 'daily_summary'}/>
              <label className={'form-check-label'}
                     htmlFor={'notification_preference_daily_summary'}>
                Daily Summaries
              </label>
            </div>
            <div className={'form-check ms-3'}>
              <input type={'radio'}
                     className={'form-check-input'}
                     name={'notificationPreference'}
                     id={'notification_preference_individually'}
                     disabled={chosenNotifications.length === 0}
                     onChange={inputChanged}
                     value={'individually'}
                     checked={formData.notificationPreference === 'individually'}/>
              <label className={'form-check-label'}
                     htmlFor={'notification_preference_individually'}>
                Individually
              </label>
            </div>
          </div>
          <div className={classes.ContactFormInput}>
            <div className={'d-flex justify-content-end'}>
              {!newContact && (
                <button type={'button'}
                        title={'Delete'}
                        onClick={deleteClicked}
                        className={'btn btn-danger me-auto'}>
                  Delete
                </button>
              )}

              <button type={'button'}
                      title={'Cancel'}
                      onClick={() => setEditing(false)}
                      className={'btn btn-secondary me-2'}>
                Cancel
              </button>
              <button type={'submit'}
                      title={'Save'}
                      disabled={!formData.valid}
                      className={'btn btn-primary'}>
                Save
              </button>
            </div>
          </div>

          <ErrorAlert message={errorMessage}
                      className={`my-3`}
                      onClose={() => setErrorMessage(null)}/>
        </form>
      }
      {!editing && !newContact &&
        <div className={`${classes.Detail}`}>
          <EditButton onClick={editClicked} />
          <p className={`fw-bold`}>
            {formData.name}
          </p>
          <p className={''}>
            {roles[formData.role]}
          </p>
          <p className={'small'}>
            {formData.email}
          </p>
          <p className={'small fst-italic'}>
            Notifications: {chosenNotifications.join(', ') || 'none'}
            {chosenNotifications.length > 0 && ` (${preferenceLabels[formData.notificationPreference]})`}
          </p>
        </div>
      }
      {!editing && newContact &&
        <div className={'text-center my-2'}>
          <button className={'btn btn-outline-primary'}
                  type={'button'}
                  onClick={() => setEditing(true)}>
            <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
            Add new contact
          </button>
        </div>
      }
    </div>
  )
}

export default ContactForm;
