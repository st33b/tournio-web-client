import {useEffect, useState} from "react";
import {formatISO, parseISO, isValid as isValidDate} from "date-fns";

import TextField from "@mui/material/TextField";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

import ErrorBoundary from "../../common/ErrorBoundary";
import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import {purchasableItemsAdded} from "../../../store/actions/directorActions";

import classes from './LedgerForm.module.scss';

const LedgerForm = ({tournament, availableTypes, onCancel, onComplete}) => {
  const context = useDirectorContext();
  const dispatch = context.dispatch;

  const initialState = {
    category: 'ledger',
    determination: '',
    name: '',
    value: '',
    applies_at: '',
    valid_until: '',
    eventIdentifiers: {}, // map of identifier to true/false
    linkedEvent: '',

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [eventSelectionAllowed, setEventSelectionAllowed] = useState(false);

  useEffect(() => {
    if (!tournament) {
      return;
    }
    // It's a tournament where bowlers can select events, rather than a traditional tournament
    if (tournament.config_items.some(ci => ci.key === 'event_selection' && ci.value)) {
      setEventSelectionAllowed(true);

      // populate the event identifiers, for both bundle_discount (if it's available) and event-linked late fee
      const identifiers = {};
      tournament.purchasable_items.filter(({determination}) => determination === 'event').map(item => {
        const id = item.identifier;
        identifiers[id] = false;
      });
      const newFormData = {...formData};
      newFormData.eventIdentifiers = identifiers;
      setFormData(newFormData);
    }
  }, [tournament]);

  const inputChanged = (elementName, event) => {
    const newFormData = {...formData};
    if (event && event.target) {
      if (elementName.startsWith('event_')) {
        const parts = elementName.split('_');
        const eventIdentifier = parts[1];
        newFormData.eventIdentifiers[eventIdentifier] = event.target.checked;
      } else if (elementName === 'value') {
        newFormData[elementName] = event.target.value.length > 0 ? parseInt(event.target.value) : '';
      } else if (elementName === 'determination') {
        switch (event.target.value) {
          case 'entry_fee':
            newFormData.name = 'Entry Fee';
            break;
          case 'early_discount':
            newFormData.name = 'Early Registration Discount';
            break;
          case 'late_fee':
            newFormData.name = 'Late Registration Fee';
            break;
          case 'bundle_discount':
            newFormData.name = 'Event Bundle Discount';
            break;
          default:
            newFormData.name = '';
            break;
        }
        newFormData[elementName] = event.target.value;
      } else {
        // It's the item name or the linked event identifier
        newFormData[elementName] = event.target.value;
      }
    } else {
      // it's from a datepicker
      newFormData[elementName] = event ? formatISO(event) : '';
    }

    newFormData.valid = isFormDataValid(newFormData);

    setFormData(newFormData);
  }

  const isFormDataValid = (data) => {
    let valid = data.name.length > 0;
    if (data.determination === 'early_discount') {
      valid = valid && data.value > 0 && isValidDate(parseISO(data.valid_until));
    } else if (data.determination === 'late_fee') {
      valid = valid && data.value > 0 && isValidDate(parseISO(data.applies_at));
    } else if (data.determination === 'bundle_discount') {
      const checkedEvents = Object.values(data.eventIdentifiers)
        .reduce((prev, current) => current ? prev + 1 : prev, 0);
      valid = valid && data.value > 0 && checkedEvents > 1;
    } else {
      valid = valid && data.value > 0;
    }
    return valid;
  }

  const submissionSuccess = (data) => {
    dispatch(purchasableItemsAdded(data));
    setFormData({...initialState});
    onComplete(`Item ${data[0].name} created.`);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const configuration = {};
    const itemData = {
      category: formData.category,
      determination: formData.determination,
      name: formData.name,
      value: formData.value,
    }
    switch (formData.determination) {
      case 'early_discount':
        configuration.valid_until = formData.valid_until;
        break;
      case 'late_fee':
        configuration.applies_at = formData.applies_at;
        if (formData.linkedEvent) {
          configuration.event = formData.linkedEvent;
          itemData.refinement = 'event_linked';
        }
        break;
      case 'bundle_discount':
        configuration.events = Object.keys(formData.eventIdentifiers).filter(id => formData.eventIdentifiers[id]);
        break;
    }
    itemData.configuration = configuration;
    const uri = `/director/tournaments/${tournament.identifier}/purchasable_items`;
    const requestConfig = {
      method: 'post',
      data: {
        purchasable_items: [
          itemData,
        ],
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: submissionSuccess,
      onFailure: (_) => console.log("Failed to save new item."),
    });
  }

  const valueProperties = {
    min: 1,
  }
  let amountLabel = 'Fee';
  if (formData.determination === 'early_discount' || formData.determination === 'bundle_discount') {
    amountLabel = 'Discount Amount';
  }

  const labels = {
    entry_fee: 'Entry fee',
    late_fee: 'Late registration fee',
    early_discount: 'Early registration discount',
    bundle_discount: 'Event Bundle Discount',
  };

  return (
    <ErrorBoundary>
      <div className={classes.LedgerForm}>
        <form onSubmit={formSubmitted} className={`mx-4 py-2`}>
          <div className={`${classes.HeaderRow} row mb-2`}>
            <h6>
              New Ledger Item
            </h6>
          </div>
          <div className={'row mb-3'}>
            <label htmlFor={'name'} className={'form-label ps-0 mb-1'}>
              Item type
            </label>
            <select className={`form-select`}
                    name={'determination'}
                    id={'determination'}
                    required={true}
                    onChange={(event) => inputChanged('determination', event)}
                    value={formData.determination}>
              <option value={''}>--</option>
              {availableTypes.map(type => <option value={type} key={type}>{labels[type]}</option>)}
            </select>
          </div>
          <div className={'row mb-3'}>
            <label htmlFor={'name'} className={'form-label ps-0 mb-1'}>
              Name
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'name'}
                   id={'name'}
                   required={true}
                   onChange={(event) => inputChanged('name', event)}
                   value={formData.name}
            />
          </div>
          {formData.determination === 'early_discount' &&
            <div className={'row mb-3'}>
              <DateTimePicker onChange={(newDateTime) => inputChanged('valid_until', newDateTime)}
                              disablePast={true}
                              value={formData.valid_until}
                              label={'Valid until'}
                              className={classes.TournioDateTimePicker}
                              renderInput={(params) => <TextField {...params} />}/>
            </div>
          }
          {formData.determination === 'late_fee' &&
            <div className={'row mb-3'}>
              <DateTimePicker onChange={(newDateTime) => inputChanged('applies_at', newDateTime)}
                              disablePast={true}
                              hideTabs={true}
                              value={formData.applies_at}
                              label={'Applies at'}
                              className={classes.TournioDateTimePicker}
                              renderInput={(params) => <TextField {...params} />}/>
            </div>
          }
          {formData.determination === 'bundle_discount' &&
            <div className={'row mb-3'}>
              <label htmlFor={'name'} className={'form-label ps-0 mb-1'}>
                Bundled Events
              </label>
              {tournament.purchasable_items.filter(({determination}) => determination === 'event').map(item => (
                <div className={'form-check form-switch'} key={item.identifier}>
                  <input className={'form-check-input'}
                         type={'checkbox'}
                         role={'switch'}
                         id={`event_${item.identifier}`}
                         name={`event_${item.identifier}`}
                         checked={formData.eventIdentifiers[item.identifier]}
                         onChange={(event) => inputChanged(`event_${item.identifier}`, event)}/>
                  <label className={'form-check-label'}
                         htmlFor={`event_${item.identifier}`}>
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          }
          {eventSelectionAllowed && formData.determination === 'late_fee' &&
            <div className={'row mb-3'}>
              <label htmlFor={'linkedEvent'} className={'form-label ps-0 mb-1'}>
                Linked Event
              </label>
              <select className={'form-select'}
                      name={'linkedEvent'}
                      id={'linkedEvent'}
                      onChange={event => inputChanged('linkedEvent', event)}>
                <option value={''}>--</option>
                {tournament.purchasable_items.filter(
                  ({category, determination}) => category === 'bowling' && determination === 'event'
                ).map(event => (
                  <option key={event.identifier} value={event.identifier}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
          }
          <div className={'row mb-3'}>
            <label htmlFor={'value'} className={'form-label ps-0 mb-1'}>
              {amountLabel}
            </label>
            <input type={'number'}
                   className={`form-control`}
                   name={'value'}
                   id={'value'}
                   required={true}
                   onChange={(event) => inputChanged('value', event)}
                   value={formData.value}
                   {...valueProperties}
            />
          </div>
          <div className={'row'}>
            <div className={'d-flex justify-content-end pe-0'}>
              <button type={'button'}
                      title={'Cancel'}
                      onClick={onCancel}
                      className={'btn btn-outline-danger me-2'}>
                <i className={'bi-x-lg'} aria-hidden={true}/>
                <span className={'visually-hidden'}>
                  Cancel
                </span>
              </button>
              <button type={'submit'}
                      title={'Save'}
                      disabled={!formData.valid}
                      className={'btn btn-outline-success'}>
                <i className={'bi-check-lg'} aria-hidden={true}/>
                <span className={'visually-hidden'}>
                  Save
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
}

export default LedgerForm;