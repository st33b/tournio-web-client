import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {format, formatISO} from "date-fns";
import Card from "react-bootstrap/Card";

import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './PurchasableItemEditForm.module.scss';
import Item from "../../Commerce/AvailableItems/Item/Item";

const PurchasableItemEditForm = ({item}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialState = {
    applies_at: '', // for ledger -> late fee
    valid_until: '', // for ledger -> early discount
    denomination: '', // for product category, denomination refinement only
    division: '', // for division refinement
    note: '', // division, product (optional)
    value: '',
    order: '',

    // new PIs only
    // category: '',
    // determination: '',
    // refinement: '',

    valid: true,
  }

  const [formData, setFormData] = useState(initialState);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!item) {
      return;
    }
    const newFormData = {
      applies_at: item.configuration.applies_at || '',
      valid_until: item.configuration.valid_until || '',
      denomination: item.configuration.denomination || '',
      division: item.configuration.division || '',
      note: item.configuration.note || '',
      value: item.value,
      order: item.configuration.order || '',
    }
    setFormData(newFormData);
  }, [item]);

  if (!context) {
    return '';
  }

  const allowEdit = context.tournament.state !== 'active';

  const toggleEdit = (event, enable) => {
    if (event) {
      event.preventDefault();
    }
    setEditing(enable);
  }

  const inputChanged = (id, event) => {
    let newValue = '';
    if (event.target) {
      newValue = event.target.value;
    } else {
      // it's from a datepicker
      newValue = formatISO(event);
    }
    if (id === 'value' || id==='order') {
      newValue = parseInt(newValue);
    }
    const newFormData = {...formData};
    newFormData[id] = newValue;
    setFormData(newFormData);
  }

  const onCancel = (event) => {
    event.preventDefault();
    const newFormData = {...formData}
    setFormData(newFormData);
    toggleEdit(null, false);
  }
  const onFormSubmit = (event) => {
    event.preventDefault();
    const uri = `/director/purchasable_items/${item.identifier}`;
    const requestConfig = {
      method: 'patch',
      data: {
        purchasable_item: {
          value: formData.value,
          configuration: {
            order: formData.order,
            applies_at: formData.applies_at,
            valid_until: formData.valid_until,
            division: formData.division,
            note: formData.note,
            denomination: formData.denomination,
          }
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: (_) => { toggleEdit(null, false) },
      onFailure: (_) => { console.log("Failed to save config item.") },
    });
  }

  let content = '';
  if (!editing) {
    const datetimeFormat = 'LLL d, yyyy h:mmaaa';
    let note = '';
    switch (item.category) {
      case 'ledger':
        switch (item.determination) {
          case 'early_discount':
            note = !!formData.valid_until ? 'Valid until ' + format(new Date(formData.valid_until), datetimeFormat) : '';
            break;
          case 'late_fee':
            note = !!formData.applies_at ? 'Applies at ' + format(new Date(formData.applies_at), datetimeFormat) : '';
            break;
        }
        break;
      case 'bowling':
        if (item.refinement === 'division') {
          note = formData.division + ' (' + formData.note + ')'
        } else {
          note = formData.note;
        }
        break;
      case 'product':
        if (item.refinement === 'denomination') {
          note = <span>{formData.denomination}</span>;
        }
        if (formData.note) {
          note = (
            <span>
              {note}
              <span className={`${classes.Subnote} d-block`}>{formData.note}</span>
            </span>
          );
        }
        break;
      default:
        break;
    }

    let orderText = '';
    if (formData.order) {
      orderText = (
        <Card.Text className={classes.Order}>
          {formData.order}.
        </Card.Text>
      );
    }
    const itemContent = (
      <div className={`${classes.Item} d-flex`}>
        {orderText}
        <Card.Text className={`me-auto`}>
          {item.name}
          <span className={`${classes.Note} d-block`}>
            {note}
          </span>
        </Card.Text>
        <Card.Text className={'fw-bold'}>
          ${formData.value}
        </Card.Text>
      </div>
    );

    if (allowEdit) {
      content = (
        <a href={'#'}
           className={'text-body text-decoration-none'}
           onClick={(event) => toggleEdit(event, true)}
           title={"Edit details"}>
          {itemContent}
        </a>
      );
    } else {
      content = itemContent;
    }
  } else {
    const inputElements = [];

    const otherValueProps = { min: 0 }
    switch (item.category) {
      case 'ledger':
        if (item.determination === 'early_discount') {
          otherValueProps.min = -1000;
          otherValueProps.max = -1;
          inputElements.push({
            type: 'datepicker',
            props: {
              onChange: (newDateTime) => inputChanged('valid_until', newDateTime),
              value: formData.valid_until,
              label: 'Valid until',
              renderInput: (params) => <TextField {...params} />,
            }
          });
        } else if (item.determination === 'late_fee') {
          otherValueProps.min = 1;
          inputElements.push({
            type: 'datepicker',
            props: {
              onChange: (newDateTime) => inputChanged('applies_at', newDateTime),
              value: formData.applies_at,
              label: 'Applies at',
              renderInput: (params) => <TextField {...params} />,
            }
          });
        }
        break;
      case 'bowling':
        // single-use, non-division items can specify their display order (within single-use, non-division items)
        if (item.determination === 'single_use' && item.refinement !== 'division') {
          inputElements.push({
            label: 'Display Order',
            type: 'number',
            name: 'order',
            id: 'order',
            value: formData.order,
            classes: '',
            others: {min: 0},
          });
        }
        if (item.refinement === 'division') {
          inputElements.push({
            label: 'Division',
            type: 'text',
            name: 'division',
            id: 'division',
            value: formData.division,
            classes: '',
            others: {},
          });
        }
        inputElements.push({
          label: 'Note',
          type: 'text',
          name: 'note',
          id: 'note',
          value: formData.note,
          classes: '',
          others: {},
        });
        break;
      case 'product':
        if (item.refinement === 'denomination') {
          inputElements.push({
            label: 'Denomination / Quantity',
            type: 'text',
            name: 'denomination',
            id: 'denomination',
            value: formData.denomination,
            classes: '',
            others: {},
          });
        }
        inputElements.push({
          label: 'Note',
          type: 'text',
          name: 'note',
          id: 'note',
          value: formData.note,
          classes: '',
          others: {},
        });
        break;
      default:
        break;
    }

    // every type has a value element
    inputElements.push({
      label: 'Value (in USD)',
      type: 'number',
      name: 'value',
      id: 'value',
      value: formData.value,
      classes: classes.ValueInput,
      others: otherValueProps,
    });

    let itemPreview = '';
    if (item.category !== 'ledger') {
      const itemPreviewProps = {...item}
      itemPreviewProps.value = formData.value;
      itemPreviewProps.configuration.order = formData.order;
      itemPreviewProps.configuration.applies_at = formData.applies_at;
      itemPreviewProps.configuration.valid_until = formData.valid_until;
      itemPreviewProps.configuration.division = formData.division;
      itemPreviewProps.configuration.note = formData.note;
      itemPreviewProps.configuration.denomination = formData.denomination;

      itemPreview = (
        <div className={'row mx-0 pt-3'}>
        <span className={classes.PreviewText}>
          How it will look to bowlers:
        </span>
          <Item item={itemPreviewProps} preview={true}/>
        </div>
      );
    }

    content = (
      <form onSubmit={onFormSubmit} className={`${classes.Form} p-2 mb-3`}>
        <fieldset>
          <legend>{item.name}</legend>
          {inputElements.map((elemProps, i) => (
              <div key={i} className={'row mx-0'}>
                {elemProps.type === 'datepicker' && <DateTimePicker {...elemProps.props} />}
                {elemProps.type !== 'datepicker' && (
                  <div>
                  <label htmlFor={elemProps.id} className={'form-label ps-0 mb-1'}>
                    {elemProps.label}
                  </label>
                  <input type={elemProps.type}
                         className={`${elemProps.classes} form-control`}
                         name={elemProps.name}
                         id={elemProps.id}
                         onChange={(event) => inputChanged(elemProps.id, event)}
                         value={elemProps.value}
                         {...elemProps.others}
                  />
                  </div>
                )}
              </div>
            ))
          }
        </fieldset>
        {itemPreview}
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
    )
  }

  return (
    <ErrorBoundary>
      <div className={classes.PurchasableItemEditForm}>
        {content}
      </div>
    </ErrorBoundary>
  );
}

export default PurchasableItemEditForm;