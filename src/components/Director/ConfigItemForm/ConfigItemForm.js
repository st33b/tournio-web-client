import {useEffect, useState, createElement} from "react";
import {useDirectorContext} from "../../../store/DirectorContext";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './ConfigItemForm.module.scss';

const ConfigItemForm = ({item}) => {
  const context = useDirectorContext();

  const initialState = {
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
    setFormData(newFormData);
  }, [item]);

  if (!context || !item) {
    return '';
  }

  // const timeZones = {
  //   'Pacific/Honolulu': {
  //     key: 'Pacific/Honolulu',
  //     display: 'Hawaii',
  //   },
  //   'America/Adak': {
  //     key: 'America/Adak',
  //     display: 'Hawaii-Aleutian',
  //   },
  //   'America/Anchorage': {
  //     key: 'America/Anchorage',
  //     display: 'Alaska',
  //   },
  //   'America/Los_Angeles': {
  //     key: 'America/Los_Angeles',
  //     display: 'Pacific',
  //   },
  //   'America/Phoenix': {
  //     key: 'America/Phoenix',
  //     display: 'MST (Phoenix)',
  //   },
  //   'America/Denver': {
  //     key: 'America/Denver',
  //     display: 'Mountain',
  //   },
  //   'America/Chicago': {
  //     key: 'America/Chicago',
  //     display: 'Central',
  //   },
  //   'America/New_York': {
  //     key: 'America/New_York',
  //     display: 'Eastern',
  //   },
  // }

  const timeZones = [
    {
      key: 'Pacific/Honolulu',
      display: 'Hawaii',
    },
    {
      key: 'America/Adak',
      display: 'Hawaii-Aleutian',
    },
    {
      key: 'America/Anchorage',
      display: 'Alaska',
    },
    {
      key: 'America/Los_Angeles',
      display: 'Pacific',
    },
    {
      key: 'America/Phoenix',
      display: 'MST (Phoenix)',
    },
    {
      key: 'America/Denver',
      display: 'Mountain',
    },
    {
      key: 'America/Chicago',
      display: 'Central',
    },
    {
      key: 'America/New_York',
      display: 'Eastern',
    },
  ]

  const allowEdit = context.tournament.state === 'setup' || context.tournament.state === 'testing';

  const toggleEdit = (event, enable) => {
    event.preventDefault();
    setEditing(enable);
  }

  const onInputChanged = (event) => {
    console.log("Input value changed");
  }

  const onFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted!");
  }

  let content = '';
  if (!editing) {
    let displayedValue = item.value;
    if (item.key === 'time_zone') {
      // displayedValue = timeZones[item.value].display;
      displayedValue = item.value;
    } else if (item.key === 'website') {
      displayedValue = (
        <a href={item.value}
           title={item.value}
           target={'_new'}>
          visit
          <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden={true} />
        </a>
      );
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
    // <input type={'text'}
    //        className={'form-control'}
    //        name={'config_item'}
    //        id={'config_item'}
    //        value={formData.value}
    //        onChange={onInputChanged}
    // />
    let elementName = '';
    let elementProps = {
      onChange: onInputChanged,
      name: 'config_item',
      id: 'config_item',
      value: formData.value,
    };
    const elementClassNames = [];
    let children = null;
    switch (item.key) {
      case 'time_zone':
        elementName = 'select';
        children = timeZones.map(tz => <option value={tz.key} key={tz.key}>{tz.display}</option>);
        elementClassNames.push('form-select');
        break;
      case 'location':
      case 'paypal_client_id':
      case 'website':
        elementName = 'input';
        elementProps.type = 'text';
        elementClassNames.push('form-control');
        break;
      case 'team_size':
        elementName = 'input';
        elementProps.type = 'number';
        elementProps.min = 1;
        elementProps.max = 6;
        elementClassNames.push('form-control');
        break;
    }
    elementProps.className = elementClassNames.join(' ');
    const inputElement = createElement(elementName, elementProps, children);
    content = (
      <form onSubmit={onFormSubmit} className={`${classes.Form} p-2 my-3`}>
        <label className={'form-label'} htmlFor={'config_item'}>
          {item.label}
        </label>
        {inputElement}
        <div className={'text-end pt-2'}>
          <button type={'button'}
                  title={'Cancel'}
                  onClick={(event) => toggleEdit(event, false)}
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