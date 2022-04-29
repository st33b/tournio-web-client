import React, {useEffect, useState} from "react";
import {CountryDropdown} from "react-country-region-selector";

import Input from "../../ui/Input/Input";
import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './BowlerForm.module.scss';

const BowlerForm = ({bowlerInfoSaved, editBowlerNum}) => {
  const {entry} = useRegistrationContext();

  const initialFormState = {
    formFields: {
      first_name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'First name',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      last_name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Last name',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      nickname: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Preferred Name',
        validation: {
          required: false,
        },
        helper: {
          url: null,
          text: '(if different from first name)',
        },
        valid: true,
        touched: false,
      },
      usbc_id: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'USBC ID',
        validation: {
          required: true,
        },
        helper: {
          url: 'https://webapps.bowl.com/USBCFindA/Home/Member',
          text: 'Look up your USBC ID',
        },
        valid: false,
        touched: false,
      },
      igbo_id: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'IGBO ID',
        validation: {
          required: true,
        },
        helper: {
          url: 'http://www.igbo.org/igbots-id-lookup/',
          text: 'Look up your IGBO ID; enter "n/a" if you don\'t have one',
        },
        valid: true,
        touched: false,
      },
      birth_month: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          value: '',
        },
        label: 'Birth month',
        validation: {
          required: true,
          min: 1,
          max: 12,
        },
        valid: false,
        touched: false,
      },
      birth_day: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          value: '',
        },
        label: 'Birth day',
        validation: {
          required: true,
          min: 1,
          max: 31,
          date: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          value: '',
        },
        label: 'Email address',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      phone: {
        elementType: 'input',
        elementConfig: {
          type: 'tel',
          value: '',
        },
        label: 'Phone number',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      address1: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Address 1',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      address2: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Address 2',
        validation: {
          required: false,
        },
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
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      state: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'State/Province',
        validation: {
          required: true,
        },
        touched: false,
      },
      country: {
        elementType: 'component',
        elementConfig: {
          component: CountryDropdown,
          value: '',
          props: {
            name: 'country',
            valueType: 'short',
            priorityOptions: ['US', 'CA', 'NZ'],
            defaultOptionLabel: '-- Choose your country',
            classes: 'form-select',
          },
        },
        label: 'Country',
        validation: {
          required: true,
        },
        touched: false,
      },
      postal_code: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'ZIP/Postal Code',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
    },
    valid: false,
    touched: false,
  }
  const [bowlerForm, setBowlerForm] = useState(initialFormState);

  useEffect(() => {
    if (!entry) {
      return;
    }

    // For each of the additional questions, we need to deep-copy the nested objects that we care about
    // (elementConfig, in this case. helper and validation won't change.)
    const formData = {...bowlerForm}
    for (let key in entry.tournament.additional_questions) {
      formData.formFields[key] = { ...entry.tournament.additional_questions[key] }
      formData.formFields[key].valid = !entry.tournament.additional_questions[key].validation.required
      formData.formFields[key].touched = false;
      formData.formFields[key].elementConfig = { ...entry.tournament.additional_questions[key].elementConfig }
    }

    setBowlerForm(formData);
  }, [entry]);

  if (!entry || !entry.tournament || !entry.bowlers) {
    return '';
  }

  const checkValidity = (value, rules) => {
    let isValid = true;

    if (rules.required) {
      isValid = isValid && value.trim().length > 0;
    }

    // Add other validity handling here. Min/max length, formatting, etc.
    if (rules.min) {
      isValid = isValid && value >= rules.min;
    }
    if (rules.max) {
      isValid = isValid && value <= rules.max;
    }

    return isValid;
  }

  let position = entry.bowlers.length + 1;
  let buttonText = 'Save Bowler';
  if (entry.team) {
    position = entry.team.bowlers.length + 1;
  }

  // In the event we're editing a bowler, populate initialFormState with their values
  if (editBowlerNum) {
    position = editBowlerNum;
    const bowlerToEdit = entry.bowlers[position - 1];
    for (const inputIdentifier in initialFormState.formFields) {
      initialFormState.formFields[inputIdentifier].elementConfig.value = bowlerToEdit[inputIdentifier];
      initialFormState.formFields[inputIdentifier].valid = checkValidity(
        bowlerToEdit[inputIdentifier],
        initialFormState.formFields[inputIdentifier].validation
      );
    }

    buttonText = 'Save Changes';
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

    // Reset the form to take in the next bowler's info
    setBowlerForm(initialFormState);

    bowlerInfoSaved(bowlerData);
  }

  const inputChangedHandler = (event, inputIdentifier) => {
    // This is the part of the form concerning the input that's changed
    const updatedFormElement = {
      ...bowlerForm.formFields[inputIdentifier]
    }
    // Deep-copy the element config, since that has the part that gets changed...
    updatedFormElement.elementConfig = { ...bowlerForm.formFields[inputIdentifier].elementConfig }

    // The country is a special snowflake...
    let newValue = null;
    if (inputIdentifier === 'country')
      newValue = event;
    else
      newValue = event.target.value;

    // Update the relevant parts of the changed field (the new value, whether it's valid, and the fact that it was changed at all)
    updatedFormElement.elementConfig.value = newValue;
    updatedFormElement.valid = checkValidity(newValue, updatedFormElement.validation);
    updatedFormElement.touched = true;

    // Create a copy of the bowler form; this is where we'll make updates
    const updatedBowlerForm = {
      ...bowlerForm
    };
    // Deep-copy the formFields property, because it's complex
    updatedBowlerForm.formFields = {
      ...bowlerForm.formFields
    }
    // Put the changed field in the copy of the bowler form structure
    updatedBowlerForm.formFields[inputIdentifier] = updatedFormElement;

    // Now, determine whether the whole form is valid
    let formIsValid = true;
    for (let inputIdentifier in updatedBowlerForm.formFields) {
      formIsValid = formIsValid && updatedBowlerForm.formFields[inputIdentifier].valid;
    }
    updatedBowlerForm.valid = formIsValid;

    updatedBowlerForm.touched = true;

    // Replace the form in state, to reflect changes based on the value that changed, and resulting validity
    setBowlerForm(updatedBowlerForm);
  }

  const formElements = [];
  for (let key in bowlerForm.formFields) {
    formElements.push({
      id: key,
      setup: bowlerForm.formFields[key],
    })
  }

  let form = (
    <form onSubmit={formHandler} noValidate>
      {formElements.map(formElement => (
        <Input
          key={formElement.id}
          identifier={formElement.id}
          elementType={formElement.setup.elementType}
          elementConfig={formElement.setup.elementConfig}
          changed={(event) => inputChangedHandler(event, formElement.id)}
          label={formElement.setup.label}
          shouldValidate={true}
          touched={formElement.setup.touched}
          invalid={!formElement.setup.valid}
          helper={formElement.setup.helper}
          validationRules={formElement.setup.validation}
        />
      ))}

      <div className="text-end pt-2">
        {/*<div className="invalid-form-warning alert alert-warning" role="alert">*/}
        {/*  There are some errors in your form. Please correct them and try again.*/}
        {/*</div>*/}
        <button className="btn btn-primary btn-lg" type="submit" disabled={!bowlerForm.valid || !bowlerForm.touched}>
          {buttonText}{' '}
          <i className="bi-chevron-double-right pl-3" aria-hidden="true"/>
        </button>

      </div>
    </form>
  );

  let headerText = 'Bowler #' + position;

  return (
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
  );
}

export default BowlerForm;