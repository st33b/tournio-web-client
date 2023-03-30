import {useEffect, useState} from "react";
import {format, formatISO} from "date-fns";
import Card from "react-bootstrap/Card";

import TextField from "@mui/material/TextField";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import ErrorBoundary from "../../common/ErrorBoundary";
import Item from "../../Commerce/AvailableItems/Item/Item";

import classes from './PurchasableItemEditForm.module.scss';
import {purchasableItemDeleted, purchasableItemUpdated} from "../../../store/actions/directorActions";

const PurchasableItemEditForm = ({tournament, item}) => {
  const context = useDirectorContext();
  const dispatch = context.dispatch;

  const initialState = {
    applies_at: '', // for ledger -> late fee
    valid_until: '', // for ledger -> early discount
    denomination: '', // for raffle category, denomination refinement only
    division: '', // for division refinement
    name: '',
    note: '', // division, product (optional)
    value: '',
    order: '',
    eventIdentifiers: {}, // map of identifier to true/false
    linkedEvent: '',

    valid: true,
  }

  const [formData, setFormData] = useState(initialState);
  const [editing, setEditing] = useState(false);

  // Populate form data
  useEffect(() => {
    if (!item) {
      return;
    }
    const eventIdentifiers = {};
    if (item.configuration.events) {
      tournament.purchasable_items.filter(({determination}) => determination === 'event').map(event => {
        const id = event.identifier;
        eventIdentifiers[id] = item.configuration.events.includes(event.identifier);
      });
    }

    const newFormData = {
      applies_at: item.configuration.applies_at || '',
      valid_until: item.configuration.valid_until || '',
      denomination: item.configuration.denomination || '',
      division: item.configuration.division || '',
      name: item.name || '',
      note: item.configuration.note || '',
      value: item.value,
      order: item.configuration.order || '',
      linkedEvent: item.configuration.event || '',
      eventIdentifiers: eventIdentifiers, // map of identifier to true/false
    }
    setFormData(newFormData);
  }, [item]);

  if (!tournament) {
    return '';
  }

  const allowEdit = !['active', 'closed'].includes(tournament.state);

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
    if (id === 'value' || id === 'order') {
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
    const configuration = {};
    switch (item.determination) {
      case 'early_discount':
        configuration.valid_until = formData.valid_until;
        break;
      case 'late_fee':
        configuration.applies_at = formData.applies_at;
        break;
      case 'bundle_discount':
        configuration.events = Object.keys(formData.eventIdentifiers).filter(id => formData.eventIdentifiers[id]);
        break;
    }
    if (formData.order) {
      configuration.order = formData.order;
    }
    if (formData.division) {
      configuration.division = formData.division;
    }
    if (formData.note) {
      configuration.note = formData.note;
    }
    if (formData.denomination) {
      configuration.denomination = formData.denomination;
    }
    const requestConfig = {
      method: 'patch',
      data: {
        purchasable_item: {
          value: formData.value,
          configuration: configuration,
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: (data) => {
        toggleEdit(null, false);
        dispatch(purchasableItemUpdated(data));
      },
      onFailure: (_) => console.log("Failed to save item."),
    });
  }

  const deleteSuccess = (_) => {
    toggleEdit(null, false);
    dispatch(purchasableItemDeleted(item));
  }

  const onDelete = (event) => {
    event.preventDefault();
    if (!confirm('Are you sure you wish to delete this item?')) {
      return;
    }
    const uri = `/director/purchasable_items/${item.identifier}`;
    const requestConfig = {
      method: 'delete',
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: deleteSuccess,
      onFailure: (data) => console.log("Failed to delete item.", data),
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
            if (!!formData.valid_until) {
              note = (
                <span className={classes.Note}>
                  Valid until {format(new Date(formData.valid_until), datetimeFormat)}
                </span>
              );
            }
            break;
          case 'late_fee':
            let part1 = '';
            if (item.refinement === 'event_linked') {
              const event = tournament.purchasable_items.find(
                pi => pi.determination === 'event' && pi.identifier === item.configuration.event
              );
              part1 = <span className={classes.Note}>{event.name}</span>;
            }
            if (!!formData.applies_at) {
              note = (
                <>
                  {part1}
                  <span className={classes.Note}>
                    Applies at {format(new Date(formData.applies_at), datetimeFormat)}
                  </span>
                </>
              );
            }
            break;
          case 'bundle_discount':
            note = (
              <>
                {tournament.purchasable_items.filter(({determination}) => determination === 'event').map(event => {
                  const eventIdentifier = event.identifier;
                  if (formData.eventIdentifiers[eventIdentifier]) {
                    return (
                      <span className={classes.Note} key={eventIdentifier}>
                        <i className={'bi-dash pe-1'} aria-hidden={true}/>
                        {event.name}
                      </span>
                    )
                  }
                })}
              </>
            )
            break;
        }
        break;
      case 'bowling':
        if (item.refinement === 'division') {
          note = <span className={classes.Note}>{formData.division} ({formData.note})</span>
        } else {
          note = <span className={classes.Note}>{formData.note}</span>;
        }
        break;
      case 'banquet':
        if (formData.note) {
          note = (
            <span className={classes.Note}>
              {formData.note}
            </span>
          )
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
          {note}
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
    const otherValueProps = {min: 0}

    // Everything has a name and a value
    const inputElements = [
      {
        label: 'Name',
        type: 'text',
        name: 'name',
        id: 'name',
        value: formData.name,
        classes: '',
        others: {},
      },
      {
        label: 'Value (in USD)',
        type: 'number',
        name: 'value',
        id: 'value',
        value: formData.value,
        classes: '',
        others: otherValueProps,
      }
    ];

    switch (item.category) {
      case 'ledger':
        if (item.determination === 'early_discount') {
          otherValueProps.min = 1;
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
          if (item.refinement === 'event_linked') {
            // push a Select item in
            // ... when we feel it's worthwhile
          }
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
        } else if (item.determination === 'bundle_discount') {
          otherValueProps.min = 1;
        }
        break;
      case 'product':
      case 'banquet':
        inputElements.push({
          label: 'Display Order',
          type: 'number',
          name: 'order',
          id: 'order',
          value: formData.order,
          classes: '',
          others: {min: 0},
        });
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
      case 'bowling':
        // single-use, non-division items can specify their display order (within single-use, non-division items)
        if (item.refinement !== 'division') {
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
      default:
        break;
    }

    let itemPreview = '';
    if (item.category !== 'ledger') {
      const itemPreviewProps = {...item};
      itemPreviewProps.value = formData.value;
      itemPreviewProps.configuration.order = formData.order;
      itemPreviewProps.configuration.applies_at = formData.applies_at;
      itemPreviewProps.configuration.valid_until = formData.valid_until;
      itemPreviewProps.configuration.division = formData.division;
      itemPreviewProps.configuration.note = formData.note;
      itemPreviewProps.configuration.denomination = formData.denomination;

      itemPreview = (
        // <div className={'row mx-0'}>
        //   <span className={classes.PreviewText}>
        //     How it will look to bowlers:
        //   </span>
        //   <Item item={itemPreviewProps} preview={true}/>
        // </div>
        //
      <div className={`row ${classes.PreviewItem}`}>
        <p className={`${classes.PreviewText}`}>
          How it will look to bowlers:
        </p>
        <Item item={itemPreviewProps} preview={true}/>
      </div>
      );
    }

    content = (
      <form onSubmit={onFormSubmit} className={`${classes.Form} px-2 pt-2 pb-3`}>
        <fieldset>
          {inputElements.map((elemProps, i) => (
            <div key={i} className={'row mx-0 mb-3'}>
              {elemProps.type === 'datepicker' && <DateTimePicker {...elemProps.props} />}
              {elemProps.type !== 'datepicker' && (
                // <div className={'px-0'}>
                <>
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
                  {/*</div>*/}
                </>
              )}
            </div>
          ))
          }
        </fieldset>
        {itemPreview}
        <div className={`d-flex justify-content-end`}>
          <button type={'button'}
                  title={'Delete'}
                  onClick={onDelete}
                  className={'btn btn-sm btn-danger me-auto'}>
            <i className={'bi-slash-circle pe-2'} aria-hidden={true}/>
            Delete
          </button>
          <button type={'button'}
                  title={'Cancel'}
                  onClick={onCancel}
                  className={'btn btn-sm btn-outline-dark me-2'}>
            <span className={'visually-hidden'}>Cancel</span>
            <i className={'bi-x-lg'} aria-hidden={true}/>
          </button>
          <button type={'submit'}
                  title={'Save'}
                  className={'btn btn-sm btn-outline-success'}>
            <span className={'visually-hidden'}>Save</span>
            <i className={'bi-check-lg'} aria-hidden={true}/>
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
