import {useState, useEffect} from "react";
import {CountryDropdown} from 'react-country-region-selector';

import Input from "../../ui/Input/Input";

import classes from './BowlerDetails.module.scss';

const BowlerDetails = ({tournament, bowler, bowlerUpdateSubmitted}) => {
  const initialFormData = {
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
          text: 'Look up a USBC ID',
        },
        valid: true,
        touched: false,
      },
      birth_month: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          value: '',
          min: 1,
          max: 12,
        },
        label: 'Birth month',
        validityErrors: [
          'valueMissing',
          'rangeUnderflow',
          'rangeOverflow',
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
        valid: true,
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
            defaultOptionLabel: "-- Choose the bowler's country",
          },
        },
        label: 'Country',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
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
    valid: true,
    touched: false,
  }

  const [bowlerForm, setBowlerForm] = useState(initialFormData);

  // This effect populates the form data with the bowler's details,
  // which should happen only once (maybe twice, since there are two dependencies)
  useEffect(() => {
    if (!bowler || !tournament) {
      return;
    }
    const newFormData = {...bowlerForm}
    // fill the initial state with the bowler's details
    for (const inputIdentifier in initialFormData.formFields) {
      let value = bowler[inputIdentifier]
      if (value === null) {
        value = '';
      }
      newFormData.formFields[inputIdentifier].elementConfig.value = value;
    }

    // For each of the additional questions, we need to deep-copy the nested objects that we care about
    // (elementConfig, in this case. helper and validation won't change.)
    tournament.additional_questions.forEach(aq => {
      const key = aq.name;
      newFormData.formFields[key] = { ...aq }
      newFormData.formFields[key].valid = true;
      newFormData.formFields[key].touched = false;
      newFormData.formFields[key].elementConfig = { ...aq.elementConfig }
      if (bowler.additional_question_responses[key]) {
        newFormData.formFields[key].elementConfig.value = bowler.additional_question_responses[key].response;
      }
    });

    setBowlerForm(newFormData);
  }, [bowler, tournament]);

  const validityForField = (fieldIdentifier, failedChecks = []) => {
    return {
      validated: true,
      valid: failedChecks.length === 0,
      validityFailures: failedChecks,
    }
  }

  const inputChangedHandler = (event, inputIdentifier) => {
    // This is the part of the form concerning the input that's changed
    let updatedFormElement = {
      ...bowlerForm.formFields[inputIdentifier]
    }
    // Deep-copy the element config, since that has the part that gets changed...
    updatedFormElement.elementConfig = { ...bowlerForm.formFields[inputIdentifier].elementConfig }

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

    // Create a copy of the bowler form; this is where we'll make updates
    const updatedBowlerForm = {
      ...bowlerForm,
    };

    // Deep-copy the formFields property, because it's complex
    updatedBowlerForm.formFields = {
      ...bowlerForm.formFields,
    }
    // Put the changed field in the copy of the bowler form structure
    updatedBowlerForm.formFields[inputIdentifier] = updatedFormElement;

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

    newFormData.valid = Object.values(newFormData.formFields).every(formField => formField.valid);

    setBowlerForm(newFormData);
  }

  const updateSubmitHandler = (event) => {
    event.preventDefault();

    if (!bowlerForm.valid) {
      return;
    }

    // Grab all the values from the form so they can be stored
    const bowlerData = {};
    for (let formElementIdentifier in bowlerForm.formFields) {
      bowlerData[formElementIdentifier] = bowlerForm.formFields[formElementIdentifier].elementConfig.value;
    }

    bowlerUpdateSubmitted(bowlerData);
  }

  if (!bowler || !tournament) {
    return '';
  }

  const formElements = [];
  for (let key in bowlerForm.formFields) {
    formElements.push({
      id: key,
      setup: bowlerForm.formFields[key],
      validateOnBlur: !!bowlerForm.formFields[key].validityErrors && !['birth_month', 'country'].includes(key),
    })
  }

  return (
    <div className={classes.BowlerDetails}>
      <form onSubmit={updateSubmitHandler} noValidate>
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
            failedValidations={typeof formElement.setup.validityFailures !== 'undefined' ? formElement.setup.validityFailures : []}
            wasValidated={formElement.setup.validated}
          />
        ))}

        <div className="text-center pt-2">
          <button className="btn btn-primary btn-lg" type="submit" disabled={!bowlerForm.valid || !bowlerForm.touched}>
            Update Details
          </button>
        </div>
      </form>
    </div>
  );
}

export default BowlerDetails;
