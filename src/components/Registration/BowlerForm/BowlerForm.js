import React, {useEffect, useState} from "react";
import {CountryDropdown} from "react-country-region-selector";

import Input from "../../ui/Input/Input";
import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './BowlerForm.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import ShiftForm from "../ShiftForm/ShiftForm";

const BowlerForm = ({tournament, bowlerInfoSaved, includeShift, bowlerData, cancelHref}) => {
  const {registration} = useRegistrationContext();

  const initialFormState = {
    formFields: {
      first_name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'First name',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
      last_name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Last name',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
      nickname: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
          placeholder: 'if different from first name',
        },
        label: 'Preferred Name',
        valid: true,
        touched: false,
      },
      usbc_id: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
          pattern: "\\d+-\\d+",
          placeholder: 'including the hyphen',
        },
        label: 'USBC ID',
        validityErrors: [
          'valueMissing',
          'patternMismatch',
        ],
        helper: {
          url: 'https://webapps.bowl.com/USBCFindA/Home/Member',
          text: 'Look up your USBC ID',
        },
        valid: true,
        touched: false,
      },
      birth_month: {
        elementType: 'select',
        elementConfig: {
          options: [
            {
              value: '',
              label: '-- Choose your month',
            },
            {
              value: 1,
              label: 'Jan'
            },
            {
              value: 2,
              label: 'Feb'
            },
            {
              value: 3,
              label: 'Mar'
            },
            {
              value: 4,
              label: 'Apr'
            },
            {
              value: 5,
              label: 'May'
            },
            {
              value: 6,
              label: 'Jun'
            },
            {
              value: 7,
              label: 'Jul'
            },
            {
              value: 8,
              label: 'Aug'
            },
            {
              value: 9,
              label: 'Sep'
            },
            {
              value: 10,
              label: 'Oct'
            },
            {
              value: 11,
              label: 'Nov'
            },
            {
              value: 12,
              label: 'Dec'
            },
          ],
          value: '',
        },
        label: 'Birth month',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
      birth_day: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          value: '',
          min: 1,
          max: 31,
        },
        label: 'Birth day',
        validityErrors: [
          'valueMissing',
          'rangeUnderflow',
          'rangeOverflow',
        ],
        valid: true,
        touched: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          value: '',
        },
        label: 'Email address',
        validityErrors: [
          'valueMissing',
          'typeMismatch',
        ],
        valid: true,
        touched: false,
      },
      phone: {
        elementType: 'input',
        elementConfig: {
          type: 'tel',
          value: '',
        },
        label: 'Phone number',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
      address1: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Address 1',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
      address2: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Address 2',
        valid: true,
        touched: false,
      },
      city: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'City',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
      state: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'State/Province',
        validityErrors: [
          'valueMissing',
        ],
        touched: false,
      },
      country: {
        elementType: 'component',
        elementConfig: {
          component: CountryDropdown,
          value: '',
          classNames: ['form-select'],
          props: {
            name: 'country',
            valueType: 'short',
            priorityOptions: ['US', 'CA', 'NZ'],
            defaultOptionLabel: '-- Choose your country',
          },
        },
        label: 'Country',
        validityErrors: [
          'valueMissing',
        ],
        touched: false,
      },
      postal_code: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'ZIP/Postal Code',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
    },
    valid: false,
    touched: false,
    soloBowlerFields: {
      preferred_shift: {
        elementType: 'radio',
        elementConfig: {
          value: '',
          choices: [],
        },
        label: 'Preferred Shift',
        validityErrors: [
          'valueMissing',
        ],
        helper: {
          url: null,
          text: `Note: A bowler's place in a shift cannot be confirmed until they have paid their registration fees.`,
        },
        valid: true,
        touched: false,
      }
    }
  }
  const [bowlerForm, setBowlerForm] = useState(initialFormState);
  const [showShiftSelection, setShowShiftSelection] = useState(false);
  const [buttonText, setButtonText] = useState('Save Bowler');
  const [showCancelButton, setShowCancelButton] = useState(false);

  const additionalFormFields = (tourn) => {
    const formFields = {};
    for (let key in tourn.additional_questions) {
      formFields[key] = { ...tourn.additional_questions[key] }
      formFields[key].valid = !tourn.additional_questions[key].validation.required
      formFields[key].touched = false;
      formFields[key].elementConfig = { ...tourn.additional_questions[key].elementConfig }
    }
    return formFields;
  }

  const resetFormData = (tourn) => {
    const formData = {...initialFormState};

    // get the additional questions
    formData.formFields = {...formData.formFields, ...additionalFormFields(tourn)};

    // put shift info in there, if needed
    if (includeShift) {
      if (tourn.available_shifts.length > 1) {
        formData.soloBowlerFields.preferred_shift.elementConfig.choices = [];
        tourn.available_shifts.map(shift => {
          formData.soloBowlerFields.preferred_shift.elementConfig.choices.push(
            { value: shift.identifier, label: shift.name }
          );
        });
        setShowShiftSelection(true);
      } else {
        formData.soloBowlerFields.preferred_shift.elementConfig.value = tourn.available_shifts[0].identifier;
        formData.soloBowlerFields.preferred_shift.valid = true;
      }
    }

    setBowlerForm(formData);
  }

  // get the additional questions into the bowler form, along with shift info if needed
  useEffect(() => {
    if (!tournament) {
      return;
    }

    resetFormData(tournament);
  }, [tournament]);

  // We're editing a bowler. Put their data into the form.
  useEffect(() => {
    if (!bowlerData || !tournament) {
      return;
    }
    const updatedBowlerForm = {...bowlerForm};
    updatedBowlerForm.formFields = {...updatedBowlerForm.formFields, ...additionalFormFields(tournament)};

    // First, all the standard fields and additional questions
    // for (const inputIdentifier in initialFormState.formFields) {
    for (const inputIdentifier in bowlerData) {
      if (updatedBowlerForm.formFields[inputIdentifier] === undefined) {
        continue;
      }
      updatedBowlerForm.formFields[inputIdentifier].elementConfig.value = bowlerData[inputIdentifier];
      fieldBlurred(null, inputIdentifier);
    }

    // Now, shift information, if there is any
    if (includeShift) {
      updatedBowlerForm.soloBowlerFields.preferred_shift.elementConfig.value = bowlerData.shift.identifier;
      updatedBowlerForm.soloBowlerFields.preferred_shift.valid = true;
    }

    setBowlerForm(updatedBowlerForm);
    setButtonText('Save Changes');
    setShowCancelButton(true);
  }, [bowlerData, tournament]);

  if (!registration || !tournament) {
    return '';
  }

  const formHandler = (event) => {
    event.preventDefault();

    if (!bowlerForm.valid) {
      return;
    }

    // Grab all the values from the form so they can be stored
    const bowlerData = {};
    for (let formElementIdentifier in bowlerForm.formFields) {
      bowlerData[formElementIdentifier] = bowlerForm.formFields[formElementIdentifier].elementConfig.value;
    }
    bowlerData.position = position;

    if (includeShift) {
      bowlerData.shift = bowlerForm.soloBowlerFields.preferred_shift.elementConfig.value;
    }

    // Reset the form to take in the next bowler's info
    resetFormData(tournament);

    bowlerInfoSaved(bowlerData);
  }

  const validityForField = (fieldIdentifier, failedChecks = []) => {
    return {
      validated: true,
      valid: failedChecks.length === 0,
      validityFailures: failedChecks,
    }
  }

  const inputChangedHandler = (event, inputIdentifier) => {
    // Create a copy of the bowler form; this is where we'll make updates
    const updatedBowlerForm = {
      ...bowlerForm
    };

    if (inputIdentifier === 'preferred_shift') {
      updatedBowlerForm.soloBowlerFields.preferred_shift.elementConfig.value = event.target.value;
    } else {
      let updatedFormElement = {
        ...bowlerForm.formFields[inputIdentifier]
      }
      // Deep-copy the element config, since that has the part that gets changed...
      updatedFormElement.elementConfig = { ...bowlerForm.formFields[inputIdentifier].elementConfig }

      // Our special snowflakes:
      let newValue = null;
      if (inputIdentifier === 'country')
        newValue = event;
      else if (updatedFormElement.elementType === 'checkbox') {
        newValue = event.target.checked ? 'yes' : 'no';
      } else
        newValue = event.target.value;

      // We need to go ahead and do validation for <select> elements, since their value isn't modified
      // between a change event (what we're reacting to here) and a blur event (which is for fieldBlurred)
      // To avoid confusion with extended form fields, we're hard-coding it to birth_month.
      if (inputIdentifier === 'birth_month') {
        const checksToRun = updatedFormElement.validityErrors;
        const {validity} = event !== null ? event.target : {};
        const failedChecks = checksToRun.filter(c => validity[c]);
        updatedFormElement = {
          ...updatedFormElement,
          ...validityForField(inputIdentifier, failedChecks),
        }
      } else if (inputIdentifier === 'country') {
        // special snowflake...
        const failedChecks = event.length === 0 ? ['valueMissing'] : [];
        updatedFormElement = {
          ...updatedFormElement,
          ...validityForField(inputIdentifier, failedChecks),
        }
      }

      // Update the relevant parts of the changed field (the new value, whether it's valid, and the fact that it was changed at all)
      updatedFormElement.elementConfig.value = newValue;
      updatedFormElement.touched = true;

      // Deep-copy the formFields property, because it's complex
      updatedBowlerForm.formFields = {
        ...bowlerForm.formFields
      }
      // Put the changed field in the copy of the bowler form structure
      updatedBowlerForm.formFields[inputIdentifier] = updatedFormElement;
    }

    updatedBowlerForm.touched = true;

    // Replace the form in state, to reflect changes based on the value that changed, and resulting validity
    setBowlerForm(updatedBowlerForm);
  }

  const fieldBlurred = (event, inputIdentifier) => {
    const newFormData = {...bowlerForm}
    const fieldIsChanged = newFormData.formFields[inputIdentifier].touched;

    const checksToRun = bowlerForm.formFields[inputIdentifier].validityErrors;
    if (!checksToRun || !fieldIsChanged) {
      // Don't update validations if we've blurred but the input was never changed
      return;
    }

    const {validity} = event !== null ? event.target : {};
    const failedChecks = checksToRun.filter(c => validity[c]);

    newFormData.formFields[inputIdentifier] = {
      ...newFormData.formFields[inputIdentifier],
      ...validityForField(inputIdentifier, failedChecks),
    };

    // Now, determine whether the whole form is valid
    const shiftFormIsValid = includeShift
      ? newFormData.soloBowlerFields.preferred_shift.elementConfig.value.length > 0
      : true;
    newFormData.valid = shiftFormIsValid && Object.values(newFormData.formFields).every(formField => formField.valid);

    setBowlerForm(newFormData);
  }

  const formElements = [];
  for (let key in bowlerForm.formFields) {
    formElements.push({
      id: key,
      setup: bowlerForm.formFields[key],
      validateOnBlur: !!bowlerForm.formFields[key].validityErrors && !['birth_month', 'country'].includes(key),
    });
  }

  let form = (
    <form onSubmit={formHandler}>
      {showShiftSelection && (
        <div>
          <ShiftForm tournament={tournament}
                     onInputChanged={(event) => inputChangedHandler(event, 'preferred_shift')}
                     currentSelection={bowlerForm.soloBowlerFields.preferred_shift.elementConfig.value}
                     name={'preferred_shift'} />
          <hr />
        </div>
      )}
      {formElements.map(formElement => (
        <Input
          key={formElement.id}
          identifier={formElement.id}
          elementType={formElement.setup.elementType}
          elementConfig={formElement.setup.elementConfig}
          changed={(event) => inputChangedHandler(event, formElement.id)}
          label={formElement.setup.label}
          helper={formElement.setup.helper}
          validityErrors={formElement.setup.validityErrors}
          // For <select> elements, onBlur is redundant to onChange
          blurred={formElement.validateOnBlur ? (event) => fieldBlurred(event, formElement.id) : false}
          failedValidations={!!formElement.setup.validityFailures ? formElement.setup.validityFailures : []}
          wasValidated={formElement.setup.validated}
        />
      ))}

      <div className="d-flex flex-row-reverse justify-content-between pt-2">
        {/*<div className="invalid-form-warning alert alert-warning" role="alert">*/}
        {/*  There are some errors in your form. Please correct them and try again.*/}
        {/*</div>*/}
        <button className="btn btn-primary btn-lg" type="submit" disabled={!bowlerForm.valid || !bowlerForm.touched}>
          {buttonText}{' '}
          <i className="bi-chevron-double-right ps-1" aria-hidden="true"/>
        </button>

        {showCancelButton && (
          <a className={'btn btn-secondary btn-lg'}
             href={cancelHref}>
            <i className={'bi-chevron-double-left pe-1'} aria-hidden={true} />
            Cancel Changes
          </a>
        )}
      </div>
    </form>
  );

  let position = 1;
  if (bowlerData) {
    position = bowlerData.position;
  } else if (registration.team) {
    position = registration.team.bowlers.length + 1;
  } else if (registration.bowlers) {
    position = registration.bowlers.length + 1;
  }

  let headerText = 'Bowler #' + position;

  return (
    <ErrorBoundary>
      <div className={classes.BowlerForm}>

        <h3>
          {headerText}
        </h3>

        <p>
          <i className={`${classes.RequiredLabel} align-top bi-asterisk`} />
          {' '}indicates a required field
        </p>

        {form}
      </div>
    </ErrorBoundary>
  );
}

export default BowlerForm;
