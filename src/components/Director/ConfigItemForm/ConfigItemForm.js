import {useEffect, useState, createElement} from "react";
import ErrorBoundary from "../../common/ErrorBoundary";
import {directorApiRequest, useTournament} from "../../../director";

import classes from './ConfigItemForm.module.scss';
import {useLoginContext} from "../../../store/LoginContext";
import {updateObject} from "../../../utils";

const BOOLEAN_CONFIG_ITEMS = [
  'automatic_discount_voids',
  'event_selection',
  'publicly_listed',
  'accept_payments',
  'display_capacity',
  'email_in_dev',
  'skip_stripe',
];

const ConfigItemForm = ({item}) => {
  const {authToken} = useLoginContext();
  const {tournament, tournamentUpdatedQuietly} = useTournament();

  const initialState = {
    prevValue: '',
    value: '',
    valid: true,
  }

  const [formData, setFormData] = useState(initialState);
  const [editing, setEditing] = useState(false);
  const [messages, setMessages] = useState({
    success: null,
    error: null,
  })

  // Populate the form data with the item prop
  useEffect(() => {
    if (!item) {
      return;
    }
    const newFormData = {...formData}
    newFormData.value = item.value;
    newFormData.prevValue = item.value;
    setFormData(newFormData);
  }, [item]);

  const onInputChanged = (event) => {
    const newFormData = {...formData};
    if (BOOLEAN_CONFIG_ITEMS.includes(item.key)) {
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
    setEditing(false);
  }

  const onSuccessfulUpdate = (configItem) => {
    setEditing(false);
    setMessages({
      ...messages,
      success: 'Update completed.',
    });

    const newConfigItems = [...tournament.config_items];
    newConfigItems.filter(({id}) => id === configItem.id).forEach(ci => ci.value = configItem.value);
    const updatedTournament = updateObject(tournament, {
      config_items: newConfigItems,
    });

    tournamentUpdatedQuietly(updatedTournament);
  }

  const onFormSubmit = (event, value = null) => {
    if (event) {
      event.preventDefault();
    }
    const valueToSend = value === null ? formData.value : value;
    const uri = `/config_items/${item.id}`;
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
      authToken: authToken,
      onSuccess: onSuccessfulUpdate,
      onFailure: (error) => { setMessages({
        ...messages,
        error: error.message,
      })},
    });
  }

  /////////////////////////

  if (!tournament || !item) {
    return '';
  }

  const allowEdit = !BOOLEAN_CONFIG_ITEMS.includes(item.key);

  let content = '';
  if (!editing) {
    let displayedValue;
    if (BOOLEAN_CONFIG_ITEMS.includes(item.key)) {
      displayedValue = (
        <div className={'form-check form-switch'}>
          <input type={'checkbox'}
                 className={'form-check-input'}
                 role={'switch'}
                 id={item.key}
                 name={'config_item'}
                 checked={formData.value}
                 onChange={onInputChanged} />
        </div>
      );
    } else {
      let displayValue = formData.value;
      let ellipsis = '';
      if (displayValue.length > 15) {
        displayValue = formData.value.substring(formData.value.length - 15);
        ellipsis = '...';
      }
      displayedValue = (
        <>
          {ellipsis}
          <span className={classes.Url}>
              {displayValue}
            </span>
        </>
      );
    }
    const itemContent = (
        <div className={`${classes.Item} d-flex`} key={item.key}>
          <dt className={'col-4'}>{item.label}</dt>
          <dd className={'ps-3 flex-grow-1 overflow-hidden'}>{displayedValue}</dd>
        </div>
    )
    content = !allowEdit ? itemContent : (
      <span className={classes.ItemWrapper}
            title={'Edit this item'}
            onClick={(e) => setEditing(true)}
      >
        {itemContent}
      </span>
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
    switch (item.key) {
      case 'team_size':
        elementName = 'input';
        elementProps.type = 'number';
        elementProps.min = 1;
        elementProps.max = 6;
        elementClassNames.push('form-control');
        break;
      case 'website':
        elementName = 'input';
        elementProps.type = 'text';
        elementClassNames.push('form-control');
        break;
      default:
        break;
    }
    elementProps.className = elementClassNames.join(' ');
    const inputElement = createElement(elementName, elementProps, children);
    content = (
      <form onSubmit={onFormSubmit} className={`${classes.Form} p-3`}>
          <label className={'form-label'} htmlFor={'config_item'}>
            {item.label}
          </label>
        {inputElement}
        <div className={'text-end pt-3'}>
          <button type={'button'}
                  title={'Cancel'}
                  onClick={onCancel}
                  className={'btn btn-sm btn-outline-danger me-2'}>
            Cancel
          </button>
          <button type={'submit'}
                  title={'Save'}
                  className={'btn btn-sm btn-outline-success'}>
            Save
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
