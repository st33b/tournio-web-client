import classes from './ContactForm.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {directorApiRequest} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";

const ContactForm = ({contact, newContact}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialState = {
    id: '',
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
    const tournament = {...context.tournament};
    if (newContact) {
      tournament.contacts = tournament.contacts.concat(data);
      setFormData(initialState);
    } else {
      const contacts = context.tournament.contacts.slice(0);
      const index = contacts.findIndex(elem => elem.id === contact.id);
      contacts[index] = data;
      tournament.contacts = contacts;
    }
    context.setTournament(tournament);
    setEditing(false);
  }

  const onFailure = (data) => {
    console.log("FAIL", data);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = newContact ? `/director/tournaments/${context.tournament.identifier}/contacts` : `/director/contacts/${contact.id}`;
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
      context: context,
      router: router,
      onSuccess: onSuccess,
      onFailure: onFailure,
    })
  }

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

  const editClicked = (event) => {
    event.preventDefault();
    setEditing(true);
  }

  return (
    <ErrorBoundary>
      <div className={`${classes.ContactForm}`}>
        {editing &&
          <form className={'mx-2'}
                onSubmit={formSubmitted}>
            <div className={'row mb-3'}>
              <label className={'form-label ps-0 mb-1'}>
                Name
              </label>
              <input type={'text'}
                     className={'form-control'}
                     required={true}
                     onChange={inputChanged}
                     name={'name'}
                     value={formData.name}/>
            </div>
            <div className={'row mb-3'}>
              <label className={'form-label ps-0 mb-1'}>
                Email Address
              </label>
              <input type={'email'}
                     className={'form-control'}
                     onChange={inputChanged}
                     name={'email'}
                     value={formData.email}/>
            </div>
            <div className={'row mb-3'}>
              <label className={'form-label ps-0 mb-1'}>
                Role
              </label>
              <select className={'form-select'}
                      name={'role'}
                      onChange={inputChanged}
                      value={formData.role}>
                <option value={''}>--</option>
                {Object.entries(roles).map(pair => <option value={pair[0]} key={pair[0]}>{pair[1]}</option>)}
              </select>
            </div>
            <div className={'row mb-3'}>
              <label className={'form-label ps-0 mb-1'}>
                Notifications to receive
              </label>
              <div className={'form-check ms-3'}>
                <input type={'checkbox'}
                       className={'form-check-input'}
                  // role={'switch'}
                       name={'notify_on_payment'}
                       id={'notify_on_payment'}
                       onChange={inputChanged}
                       checked={formData.notify_on_payment}/>
                <label className={'form-check-label'}
                       htmlFor={'notify_on_payment'}>
                  Payment received
                </label>
              </div>
              <div className={'form-check ms-3'}>
                <input type={'checkbox'}
                       className={'form-check-input'}
                  // role={'switch'}
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
            <div className={'row mb-3'}>
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
            <div className={'row'}>
              <div className={'d-flex justify-content-between p-0'}>
                <button className={'btn btn-outline-danger'}
                        type={'button'}
                        onClick={() => setEditing(false)}>
                  <i className={'bi-x-lg pe-2'} aria-hidden={true}/>
                  Cancel
                </button>
                <button type={'submit'}
                        disabled={!formData.valid}
                        className={'btn btn-primary'}>
                  Save
                  <i className={'bi-chevron-right ps-2'} aria-hidden={true}/>
                </button>
              </div>
            </div>
          </form>
        }
        {!editing && !newContact &&
          <div className={`row ${classes.Detail}`}>
            <p className={`fw-bold m-0 d-flex`}>
              {formData.name}
              <a href={'#'}
                 className={`${classes.EditLink} ms-auto`}
                 onClick={editClicked}>
                <span className={'visually-hidden'}>Edit</span>
                <i className={'bi-pencil'} aria-hidden={true}/>
              </a>

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
          </div>
        }
        {!editing && newContact &&
          <div className={'row'}>
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
    </ErrorBoundary>
  )
}

export default ContactForm;