import {useEffect, useState} from "react";

import {directorApiRequest} from "../../../director";

import classes from './ActiveTournament.module.scss';
import {updateObject} from "../../../utils";

const ContactForm = ({contact, newContact}) => {
  const initialState = {
    identifier: '',
    name: '',
    role: '',
    email: '',
    notify_on_registration: false,
    notify_on_payment: false,
    notification_preference: 'daily_summary',

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({...contact});
    }
  }, [contact, newContact]);

  const isValid = (data) => {
    return data.name.length > 0
      && data.role.length > 0
      && ['daily_summary', 'individually'].includes(data.notification_preference);
  }

  const inputChanged = (event) => {
    const newFormData = {...formData};
    if (event.target.name === 'notify_on_payment' || event.target.name === 'notify_on_registration') {
      newFormData[event.target.name] = event.target.checked;
    } else {
      newFormData[event.target.name] = event.target.value;
    }
    newFormData.valid = isValid(newFormData);
    setFormData(newFormData)
  }

  const onSuccess = (data) => {
    const modifiedTournament = updateObject(tournament, {
      contacts: tournament.contacts.concat(data),
    });
    if (newContact) {
      setFormData(initialState);
      modifiedTournament.contacts = tournament.contacts.concat(data);
    } else {
      const index = modifiedTournament.contacts.findIndex(({identifier}) => identifier === data.identifier);
      modifiedTournament.contacts[index] = data;
    }

    tournamentUpdatedQuietly(modifiedTournament);
    setEditing(false);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = newContact ? `/tournaments/${tournament.identifier}/contacts` : `/contacts/${contact.identifier}`;
    const requestConfig = {
      method: newContact ? 'post' : 'patch',
      data: {
        contact: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          notify_on_registration: formData.notify_on_registration,
          notify_on_payment: formData.notify_on_payment,
          notification_preference: formData.notification_preference,
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: onSuccess,
    })
  }

  const editClicked = (event) => {
    event.preventDefault();
    setEditing(true);
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
  if (formData.notify_on_payment) {
    chosenNotifications.push('payments');
  }
  if (formData.notify_on_registration) {
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
                     name={'notify_on_payment'}
                     id={'notify_on_payment'}
                     onChange={inputChanged}
                     checked={formData.notify_on_payment}/>
              <label className={'form-check-label'}
                     htmlFor={'notify_on_payment'}>
                Payment received
              </label>
            </div>
            <div className={'form-check form-switch ms-3'}>
              <input type={'checkbox'}
                     className={'form-check-input'}
                     role={'switch'}
                     name={'notify_on_registration'}
                     id={'notify_on_registration'}
                     onChange={inputChanged}
                     checked={formData.notify_on_registration}/>
              <label className={'form-check-label'}
                     htmlFor={'notify_on_registration'}>
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
                     name={'notification_preference'}
                     id={'notification_preference_daily_summary'}
                     disabled={chosenNotifications.length === 0}
                     onChange={inputChanged}
                     value={'daily_summary'}
                     checked={formData.notification_preference === 'daily_summary'}/>
              <label className={'form-check-label'}
                     htmlFor={'notification_preference_daily_summary'}>
                Daily Summaries
              </label>
            </div>
            <div className={'form-check ms-3'}>
              <input type={'radio'}
                     className={'form-check-input'}
                     name={'notification_preference'}
                     id={'notification_preference_individually'}
                     disabled={chosenNotifications.length === 0}
                     onChange={inputChanged}
                     value={'individually'}
                     checked={formData.notification_preference === 'individually'}/>
              <label className={'form-check-label'}
                     htmlFor={'notification_preference_individually'}>
                Individually
              </label>
            </div>
          </div>
          <div className={classes.ContactFormInput}>
            <div className={'d-flex justify-content-end'}>
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
        </form>
      }
      {!editing && !newContact &&
        <div className={`${classes.Detail} px-3 py-2`}>
          <a href={'#'}
             className={'text-body text-decoration-none'}
             onClick={editClicked}
             title={'Edit contact details'}>
            <p className={`fw-bold m-0 d-flex`}>
              {formData.name}
            </p>
            <p className={'m-0'}>
              {roles[formData.role]}
            </p>
            <p className={'small m-0'}>
              {formData.email}
            </p>
            <p className={'small m-0 fst-italic'}>
              Notifications: {chosenNotifications.join(', ') || 'none'}
              {chosenNotifications.length > 0 && ` (${preferenceLabels[formData.notification_preference]})`}
            </p>
          </a>
        </div>
      }
      {!editing && newContact &&
        <div className={classes.InputItem}>
          <div className={'text-center'}>
            <button className={'btn btn-outline-primary'}
                    type={'button'}
                    onClick={() => setEditing((true))}>
              <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
              Add
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default ContactForm;
