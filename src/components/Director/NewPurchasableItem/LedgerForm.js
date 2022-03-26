import {useState} from "react";
import {useRouter} from "next/router";

import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './LedgerForm.module.scss';
import {formatISO, parseISO, isValid as isValidDate} from "date-fns";

const LedgerForm = ({availableTypes, onCancel, onComplete}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialState = {
    category: 'ledger',
    determination: '',
    name: '',
    value: '',
    applies_at: '',
    valid_until: '',

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);

  const inputChanged = (elementName, event) => {
    let newValue = '';
    const newFormData = {...formData};
    if (event && event.target) {
      newValue = event.target.value;
      if (elementName === 'value') {
        newValue = parseInt(newValue);
      }
      if (elementName === 'determination') {
        switch (newValue) {
          case 'entry_fee':
            newFormData.name = 'Entry Fee';
            break;
          case 'early_discount':
            newFormData.name = 'Early Registration Discount';
            break;
          case 'late_fee':
            newFormData.name = 'Late Registration Fee';
            break;
          default:
            newFormData.name = '';
            break;
        }
      }
    } else {
      // it's from a datepicker
      newValue = event ? formatISO(event) : '';
    }
    newFormData[elementName] = newValue;

    newFormData.valid = isFormDataValid(newFormData);

    setFormData(newFormData);
  }

  const isFormDataValid = (data) => {
    let valid = data.name.length > 0;
    if (data.determination === 'early_discount') {
      valid = valid && data.value < 0 && isValidDate(parseISO(data.valid_until));
    } else if (data.determination === 'late_fee') {
      valid = valid && data.value > 0 && isValidDate(parseISO(data.applies_at));
    } else {
      valid = valid && data.value > 0;
    }
    return valid;
  }

  const submissionSuccess = (data) => {
    setFormData({...initialState});
    const tournament = {...context.tournament}
    tournament.purchasable_items = tournament.purchasable_items.concat(data);
    context.setTournament(tournament);
    onComplete(`Item ${data[0].name} created.`);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = `/director/tournaments/${context.tournament.identifier}/purchasable_items`;
    const requestConfig = {
      method: 'post',
      data: {
        purchasable_items: [
          {
            category: formData.category,
            determination: formData.determination,
            name: formData.name,
            value: formData.value,
            configuration: {
              applies_at: formData.applies_at,
              valid_until: formData.valid_until,
            },
          },
        ],
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: submissionSuccess,
      onFailure: (_) => {
        console.log("Failed to save new item.")
      },
    });
  }

  const valueProperties = {}
  if (formData.determination === 'early_discount') {
    valueProperties.max = -1;
  } else {
    valueProperties.min = 1;
  }

  const labels = {
    entry_fee: 'Entry fee',
    late_fee: 'Late registration fee',
    early_discount: 'Early registration discount',
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
                              value={formData.valid_until}
                              label={'Valid until'}
                              renderInput={(params) => <TextField {...params} />}/>
            </div>
          }
          {formData.determination === 'late_fee' &&
            <div className={'row mb-3'}>
              <DateTimePicker onChange={(newDateTime) => inputChanged('applies_at', newDateTime)}
                              value={formData.applies_at}
                              label={'Applies at'}
                              renderInput={(params) => <TextField {...params} />}/>
            </div>
          }
          <div className={'row mb-3'}>
            <label htmlFor={'value'} className={'form-label ps-0 mb-1'}>
              Fee
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
            <div className={'d-flex justify-content-between p-0'}>
              <button type={'button'}
                      title={'Cancel'}
                      onClick={onCancel}
                      className={'btn btn-outline-danger'}>
                <i className={'bi-x-lg pe-2'} aria-hidden={true}/>
                Cancel
              </button>
              <button type={'submit'}
                      title={'Save'}
                      disabled={!formData.valid}
                      className={'btn btn-success'}>
                Save
                <i className={'bi-chevron-right ps-2'} aria-hidden={true}/>
              </button>
            </div>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
}

export default LedgerForm;