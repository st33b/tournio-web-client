import React, {useEffect, useState} from "react";
import {format, formatISO} from "date-fns";
import Card from "react-bootstrap/Card";

import TextField from "@mui/material/TextField";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import ErrorBoundary from "../../common/ErrorBoundary";
import Item from "../../Commerce/AvailableItems/Item/Item";

import classes from './PurchasableItemEditForm.module.scss';
import {purchasableItemDeleted, purchasableItemUpdated, sizedItemUpdated} from "../../../store/actions/directorActions";
import AvailableSizes from "../ApparelItemForm/AvailableSizes";
import {devConsoleLog, apparelSizes} from "../../../utils";

const PurchasableItemEditForm = ({tournament, item}) => {
  const context = useDirectorContext();
  const dispatch = context.dispatch;

  const initialState = {
    fields: {
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
      sizes: {},
    },

    valid: true,
  }

  const [formData, setFormData] = useState(initialState);
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState();

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
      fields: {
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
        sizes: item.configuration.sizes || {},
      },
    };
    newFormData.valid = isValid(newFormData.fields);
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

  const isValid = (fields) => {
    const sizesAreGood = fields.determination !== 'apparel' ? true : sizesAreValid(fields.sizes);
    return sizesAreGood && fields.name.length > 0 && fields.value > 0 && fields.order > 0;
  }

  const sizesAreValid = (sizes) => {
    if (sizes.one_size_fits_all) {
      return true;
    }
    return Object.keys(apparelSizes).map(k => {
      const sizeMap = sizes[k];
      return Object.values(sizeMap).some(sizePresent => !!sizePresent)
    }).some(val => !!val);
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
      if (isNaN(newValue)) {
        newValue = 0;
      }
    }
    const newFormData = {
      fields: {
        ...formData.fields,
      },
    };
    newFormData.fields[id] = newValue;
    newFormData.valid = isValid(newFormData.fields);
    setFormData(newFormData);
  }

  /**
   * sizeIdentifier is a path through the size map, e.g.,
   *   one_size_fits_all
   *   unisex.xs
   *   infant.m12
   */
  const sizeChanged = (sizeIdentifier, isChosen) => {
    const newFormData = {
      fields: {
        ...formData.fields,
        sizes: {
          ...formData.fields.sizes,
        },
      },
    };

    if (sizeIdentifier === 'one_size_fits_all') {
      newFormData.fields.sizes.one_size_fits_all = !!isChosen
    } else {
      const pathParts = sizeIdentifier.split('.');
      newFormData.fields.sizes[pathParts[0]][pathParts[1]] = !!isChosen;
    }
    newFormData.valid = isValid(newFormData.fields);
    setFormData(newFormData);
  }

  /**
   * Sets all the sizes in a set to true or false
   * @param setIdentifier The identifier of the set to modify
   * @param newValue true or false
   */
  const setAllSizesInSet = (setIdentifier, newValue) => {
    const newFormData = {
      fields: {
        ...formData.fields,
        sizes: {
          ...formData.fields.sizes,
        },
      },
    };
    Object.keys(newFormData.fields.sizes[setIdentifier]).forEach(size => newFormData.fields.sizes[setIdentifier][size] = !!newValue);
    newFormData.valid = isValid(newFormData.fields);
    setFormData(newFormData);
  }


  const onCancel = (event) => {
    event.preventDefault();
    toggleEdit(null, false);
  }

  const onFormSubmit = (event) => {
    event.preventDefault();
    const uri = `/director/purchasable_items/${item.identifier}`;
    const configuration = {};
    const requestConfig = {
      method: 'patch',
      data: {
        purchasable_item: {
          name: formData.fields.name,
          value: formData.fields.value,
        },
      },
    };
    let updatingSizedApparel = false;
    switch (item.determination) {
      case 'early_discount':
        configuration.valid_until = formData.fields.valid_until;
        break;
      case 'late_fee':
        configuration.applies_at = formData.fields.applies_at;
        break;
      case 'bundle_discount':
        configuration.events = Object.keys(formData.fields.eventIdentifiers).filter(id => formData.fields.eventIdentifiers[id]);
        break;
      case 'apparel':
        if (formData.fields.sizes.one_size_fits_all) {
          configuration.size = 'one_size_fits_all';
        } else {
          requestConfig.data.purchasable_item.refinement = 'sized';
          configuration.sizes = {};
          for (const sizeGroup in apparelSizes) {
            configuration.sizes[sizeGroup] = formData.fields.sizes[sizeGroup];
          };
          updatingSizedApparel = true;
        }
        break;
    }
    if (formData.fields.order) {
      configuration.order = formData.fields.order;
    }
    if (formData.fields.division) {
      configuration.division = formData.fields.division;
    }
    if (formData.fields.note) {
      configuration.note = formData.fields.note;
    }
    if (formData.fields.denomination) {
      configuration.denomination = formData.fields.denomination;
    }

    requestConfig.data.purchasable_item.configuration = configuration;
    // return;
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: (data) => {
        toggleEdit(null, false);
        setSuccessMessage("Item details updated.");
        if (updatingSizedApparel) {
          dispatch(sizedItemUpdated(data));
        } else {
          dispatch(purchasableItemUpdated(data));
        }
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
            if (!!formData.fields.valid_until) {
              note = (
                <span className={classes.Note}>
                  Valid until {format(new Date(formData.fields.valid_until), datetimeFormat)}
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
            if (!!formData.fields.applies_at) {
              note = (
                <>
                  {part1}
                  <span className={classes.Note}>
                    Applies at {format(new Date(formData.fields.applies_at), datetimeFormat)}
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
                  if (formData.fields.eventIdentifiers[eventIdentifier]) {
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
          note = <span className={classes.Note}>{formData.fields.division} ({formData.fields.note})</span>
        } else {
          note = <span className={classes.Note}>{formData.fields.note}</span>;
        }
        break;
      case 'banquet':
      case 'product':
        if (formData.fields.note) {
          note = (
            <span className={classes.Note}>
              {formData.fields.note}
            </span>
          )
        }
        break;
      default:
        break;
    }

    let orderText = '';
    if (formData.fields.order) {
      orderText = (
        <Card.Text className={classes.Order}>
          {formData.fields.order}.
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
          ${formData.fields.value}
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
        value: formData.fields.name,
        classes: '',
        others: {},
      },
      {
        label: 'Value (in USD)',
        type: 'number',
        name: 'value',
        id: 'value',
        value: formData.fields.value,
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
              value: formData.fields.valid_until,
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
              value: formData.fields.applies_at,
              label: 'Applies at',
              renderInput: (params) => <TextField {...params} />,
            }
          });
        } else if (item.determination === 'bundle_discount') {
          otherValueProps.min = 1;
        }
        break;
      case 'product':
        if (formData.fields.refinement === 'apparel') {
          inputElements.push({
            type: 'component',
            component: AvailableSizes,
            args: {
              selectedSizes: formData.fields.sizes,
              onSizeChanged: () => {},
              onAllInGroupSet: () => {},
            }
          });
        }
        inputElements.push({
          label: 'Display Order',
          type: 'number',
          name: 'order',
          id: 'order',
          value: formData.fields.order,
          classes: '',
          others: {min: 0},
        });
        inputElements.push({
          label: 'Note',
          type: 'text',
          name: 'note',
          id: 'note',
          value: formData.fields.note,
          classes: '',
          others: {},
        });
        break;
      case 'banquet':
      case 'raffle':
        inputElements.push({
          label: 'Display Order',
          type: 'number',
          name: 'order',
          id: 'order',
          value: formData.fields.order,
          classes: '',
          others: {min: 0},
        });
        inputElements.push({
          label: 'Note',
          type: 'text',
          name: 'note',
          id: 'note',
          value: formData.fields.note,
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
            value: formData.fields.order,
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
            value: formData.fields.division,
            classes: '',
            others: {},
          });
        }
        inputElements.push({
          label: 'Note',
          type: 'text',
          name: 'note',
          id: 'note',
          value: formData.fields.note,
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
      itemPreviewProps.value = formData.fields.value;
      itemPreviewProps.configuration.order = formData.fields.order;
      itemPreviewProps.configuration.applies_at = formData.fields.applies_at;
      itemPreviewProps.configuration.valid_until = formData.fields.valid_until;
      itemPreviewProps.configuration.division = formData.fields.division;
      itemPreviewProps.configuration.note = formData.fields.note;
      itemPreviewProps.configuration.denomination = formData.fields.denomination;

      itemPreview = (
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
              {elemProps.type === 'component' && React.createElement(elemProps.component, {
                ...elemProps.args,
              })}
              {!['datepicker', 'component'].includes(elemProps.type) && (
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
          ))}
          {item.determination === 'apparel' && (
            <div className={`row mx-0 mb-3`}>
              <AvailableSizes selectedSizes={formData.fields.sizes}
                              onSizeChanged={sizeChanged}
                              onAllInGroupSet={setAllSizesInSet}
                              />
            </div>
          )}
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
                  className={'btn btn-sm btn-outline-secondary me-2'}>
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
        {successMessage && (
          <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center m-3'}
               role={'alert'}>
            <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
            <div className={'me-auto'}>
              {successMessage}
              <button type="button"
                      className={"btn-close"}
                      data-bs-dismiss="alert"
                      onClick={() => setSuccessMessage(null)}
                      aria-label="Close"/>
            </div>
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
}

export default PurchasableItemEditForm;
