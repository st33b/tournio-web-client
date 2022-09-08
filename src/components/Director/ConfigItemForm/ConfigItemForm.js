import {useEffect, useState, createElement} from "react";
import {format, formatISO} from "date-fns";
import {useRouter} from "next/router";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/x-date-pickers/AdapterDateFns";
import LocalizationProvider from "@mui/x-date-pickers/LocalizationProvider";
import DateTimePicker from "@mui/x-date-pickers/DateTimePicker";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './ConfigItemForm.module.scss';

const BOOLEAN_CONFIG_ITEMS = ['display_capacity', 'email_in_dev', 'event_selection'];

const ConfigItemForm = ({item}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialState = {
    prevValue: '',
    value: '',
    valid: true,
  }

  const [formData, setFormData] = useState(initialState);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!item) {
      return;
    }
    const newFormData = {...formData}
    newFormData.value = item.value;
    newFormData.prevValue = item.value;
    setFormData(newFormData);
  }, [item]);

  if (!context || !item) {
    return '';
  }

  const timeZones = {
    'Pacific/Honolulu': {
      key: 'Pacific/Honolulu',
      display: 'Hawaii (HST)',
    },
    'America/Adak': {
      key: 'America/Adak',
      display: 'Hawaii-Aleutian (HST/HDT)',
    },
    'America/Anchorage': {
      key: 'America/Anchorage',
      display: 'Alaska (AKST/AKDT)',
    },
    'America/Los_Angeles': {
      key: 'America/Los_Angeles',
      display: 'Pacific (PST/PDT)',
    },
    'America/Phoenix': {
      key: 'America/Phoenix',
      display: 'Phoenix (MST)',
    },
    'America/Denver': {
      key: 'America/Denver',
      display: 'Mountain (MST/MDT)',
    },
    'America/Chicago': {
      key: 'America/Chicago',
      display: 'Central (CST/CDT)',
    },
    'America/New_York': {
      key: 'America/New_York',
      display: 'Eastern (EST/EDT)',
    },
  }

  const allowEdit = context.tournament.state !== 'active' && !BOOLEAN_CONFIG_ITEMS.includes(item.key);

  const toggleEdit = (event, enable) => {
    if (event) {
      event.preventDefault();
    }
    setEditing(enable);
  }

  const onInputChanged = (event) => {
    const newFormData = {...formData};
    if (item.key === 'entry_deadline') {
      newFormData.value = formatISO(event);
    } else if (BOOLEAN_CONFIG_ITEMS.includes(item.key)) {
      newFormData.value = event.target.checked;
    } else {
      newFormData.value = event.target.value;
    }
    newFormData.valid = newFormData.value.length > 0;
    setFormData(newFormData);

    if (BOOLEAN_CONFIG_ITEMS.includes(item.key)) {
      onFormSubmit(null, newFormData.value);
    }
  }

  const onCancel = (event) => {
    event.preventDefault();
    const newFormData = {...formData}
    newFormData.value = newFormData.prevValue;
    setFormData(newFormData);
    toggleEdit(null, false);
  }
  const onFormSubmit = (event, value = null) => {
    if (event) {
      event.preventDefault();
    }
    const valueToSend = value === null ? formData.value : value;
    const uri = `/director/config_items/${item.id}`;
    const requestConfig = {
      method: 'patch',
      data: {
        config_item: {
          value: valueToSend,
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: (_) => { toggleEdit(null, false) },
      onFailure: (data) => { console.log("Failed to save config item.", data) },
    });
  }

  let content = '';
  if (!editing) {
    let displayedValue = '';
    switch (item.key) {
      case 'time_zone':
        displayedValue = formData.value ? timeZones[formData.value].display : '';
        break;
      case 'website':
        displayedValue = (
          <a href={formData.value}
             title={formData.value}
             target={'_new'}>
            visit
            <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden={true} />
          </a>
        );
        break;
      case 'entry_deadline':
        displayedValue = formData.value ? format(new Date(formData.value), 'PPp') : '';
        break;
      case 'display_capacity':
      case 'email_in_dev':
      case 'event_selection':
        displayedValue = (
          <div className={'form-check'}>
            <input type={'checkbox'}
                   className={'form-check-input'}
                   // role={'switch'}
                   name={'config_item'}
                   checked={formData.value}
                   onChange={onInputChanged} />
          </div>
        );
        break;
      default:
        displayedValue = formData.value;
        break;
    }
    content = (
      <div className={`${classes.Item} d-flex`} key={item.key}>
        <dt className={'col-4'}>{item.label}</dt>
        <dd className={'ps-3 flex-grow-1 overflow-hidden'}>{displayedValue}</dd>
        {allowEdit &&
          <a href={'#'}
             className={`${classes.EditLink} ms-auto`}
             onClick={(event) => toggleEdit(event, true)}>
            <span className={'visually-hidden'}>Edit</span>
            <i className={'bi-pencil'} aria-hidden={true}/>
          </a>
        }
      </div>
    );
  } else {
    let elementName = '';
    let elementProps = {
      onChange: onInputChanged,
      name: 'config_item',
      id: 'config_item',
      value: formData.value,
    };
    const elementClassNames = [];
    let children = null;
    let inputElement = null;
    let wrapperClass = '';
    switch (item.key) {
      case 'time_zone':
        elementName = 'select';
        children = Object.values(timeZones).map(tz => <option value={tz.key} key={tz.key}>{tz.display}</option>);
        elementClassNames.push('form-select');
        break;
      case 'team_size':
        elementName = 'input';
        elementProps.type = 'number';
        elementProps.min = 1;
        elementProps.max = 6;
        elementClassNames.push('form-control');
        break;
      case 'entry_deadline':
        inputElement = (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker onChange={onInputChanged}
                            value={formData.value}
                            label={'Entry Deadline'}
                            renderInput={(params) => <TextField {...params} />}
                            />
          </LocalizationProvider>
        )
        break;
      case 'location':
      case 'paypal_client_id':
      case 'website':
        elementName = 'input';
        elementProps.type = 'text';
        elementClassNames.push('form-control');
        break;
      default:
        break;
    }
    elementProps.className = elementClassNames.join(' ');
    if (inputElement === null) {
      inputElement = createElement(elementName, elementProps, children);
    }
    content = (
      <form onSubmit={onFormSubmit} className={`${classes.Form} p-2 mb-3`}>
        {item.key !== 'entry_deadline' &&
          <label className={'form-label'} htmlFor={'config_item'}>
            {item.label}
          </label>
        }
        {inputElement}
        <div className={'text-end pt-2'}>
          <button type={'button'}
                  title={'Cancel'}
                  onClick={onCancel}
                  className={'btn btn-sm btn-outline-danger me-2'}>
            <span className={'visually-hidden'}>Cancel</span>
            <i className={'bi-x-lg'} aria-hidden={true} />
          </button>
          <button type={'submit'}
                  title={'Save'}
                  className={'btn btn-sm btn-outline-success'}>
            <span className={'visually-hidden'}>Save</span>
            <i className={'bi-check-lg'} aria-hidden={true} />
          </button>
        </div>
      </form>
    );
  }

  return (
    <ErrorBoundary>
      <div className={classes.ConfigItemForm}>
        {content}
      </div>
    </ErrorBoundary>
  );
}

export default ConfigItemForm;