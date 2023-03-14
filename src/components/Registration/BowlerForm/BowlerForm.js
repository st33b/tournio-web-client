import React, {useEffect, useState} from "react";
import {CountryDropdown} from "react-country-region-selector";

import Input from "../../ui/Input/Input";
import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './BowlerForm.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import {devConsoleLog} from "../../../utils";

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
      // igbo_id: {
      //   elementType: 'input',
      //   elementConfig: {
      //     type: 'text',
      //     value: '',
      //   },
      //   label: 'IGBO ID',
      //   validation: {
      //     required: true,
      //   },
      //   helper: {
      //     url: 'http://www.igbo.org/igbots-id-lookup/',
      //     text: 'Look up your IGBO ID; enter "n/a" if you don\'t have one',
      //   },
      //   valid: true,
      //   touched: false,
      // },
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
        validation: {
          required: true,
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
          pattern: /^[^\s]+@\S+\.\S{2,}$/,
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
    soloBowlerFields: {
      preferred_shift: {
        elementType: 'radio',
        elementConfig: {
          value: '',
          choices: [],
        },
        label: 'Preferred Shift',
        validation: {
          required: true,
        },
        helper: {
          url: null,
          text: `Note: A bowler's place in a shift is not confirmed until they have paid their registration fees.`,
        },
        valid: false,
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
    devConsoleLog("calling resetFormData");
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
    devConsoleLog("tournament effect...")
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
      updatedBowlerForm.formFields[inputIdentifier].valid = checkValidity(
        bowlerData[inputIdentifier],
        updatedBowlerForm.formFields[inputIdentifier].validation
      );
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
    devConsoleLog("Registration?", registration);
    devConsoleLog("Tournament?", tournament);
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

    if (rules.pattern) {
      isValid = isValid && rules.pattern.test(value);
    }

    return isValid;
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

  const inputChangedHandler = (event, inputIdentifier) => {
    // Create a copy of the bowler form; this is where we'll make updates
    const updatedBowlerForm = {
      ...bowlerForm
    };

    if (inputIdentifier === 'preferred_shift') {
      devConsoleLog("Value of preferred shift", event.target.value);
      updatedBowlerForm.soloBowlerFields.preferred_shift.elementConfig.value = event.target.value;
      updatedBowlerForm.touched = true;
    } else {
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
      else if (updatedFormElement.elementType === 'checkbox') {
        newValue = event.target.checked ? 'yes' : 'no';
      }
      else
        newValue = event.target.value;

      // Update the relevant parts of the changed field (the new value, whether it's valid, and the fact that it was changed at all)
      updatedFormElement.elementConfig.value = newValue;
      updatedFormElement.valid = checkValidity(newValue, updatedFormElement.validation);
      updatedFormElement.touched = true;

      // Deep-copy the formFields property, because it's complex
      updatedBowlerForm.formFields = {
        ...bowlerForm.formFields
      }
      // Put the changed field in the copy of the bowler form structure
      updatedBowlerForm.formFields[inputIdentifier] = updatedFormElement;
    }

    // Now, determine whether the whole form is valid
    let formIsValid = includeShift
      ? updatedBowlerForm.soloBowlerFields.preferred_shift.elementConfig.value.length > 0
      : true;
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
      {showShiftSelection && (
        <div>
          <Input
            key={'preferred_shift'}
            identifier={'preferred_shift'}
            elementType={bowlerForm.soloBowlerFields.preferred_shift.elementType}
            elementConfig={bowlerForm.soloBowlerFields.preferred_shift.elementConfig}
            changed={(event) => inputChangedHandler(event, 'preferred_shift')}
            label={bowlerForm.soloBowlerFields.preferred_shift.label}
            shouldValidate={true}
            touched={bowlerForm.soloBowlerFields.preferred_shift.touched}
            invalid={!bowlerForm.soloBowlerFields.preferred_shift.valid}
            validationRules={bowlerForm.soloBowlerFields.preferred_shift.validation}
            helper={bowlerForm.soloBowlerFields.preferred_shift.helper}
          />
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
          shouldValidate={true}
          touched={formElement.setup.touched}
          invalid={!formElement.setup.valid}
          helper={formElement.setup.helper}
          validationRules={formElement.setup.validation}
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
