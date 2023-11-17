import React, {useEffect, useState} from "react";
import {CountryDropdown} from "react-country-region-selector";

import Input from "../../ui/Input/Input";
import ErrorBoundary from "../../common/ErrorBoundary";
import {devConsoleLog, validateEmail} from "../../../utils";

import classes from './BowlerForm.module.scss';

const BowlerForm = ({tournament, bowlerInfoSaved, bowlerData, availablePartners = [], nextButtonText}) => {
  // These are the required ones
  const minimumFormFields = {
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
      errorMessages: {
        typeMismatch: "That's not a valid email address",
      },
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
  }

  // These are configurable by the tournament
  const potentialFormFields = {
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
      errorMessages: {
        patternMismatch: 'Just digits and a hyphen, e.g., 123-4567',
      },
      helper: {
        url: 'https://webapps.bowl.com/USBCFindA/Home/Member',
        text: 'Look up your USBC ID',
      },
      valid: true,
      touched: false,
    },
    date_of_birth: {
      elementType: 'combo',
      elementConfig: {
        elements: [
          {
            // Month
            identifier: 'month',
            elementType: 'select',
            elementConfig: {
              options: [
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
              value: 1,
              labelClasses: ['visually-hidden'],
              layoutClass: 'col-4 col-lg-3',
            },
            label: 'Month',
            validityErrors: [
              'valueMissing',
            ],
            valid: true,
            touched: false,
          },
          {
            // Day
            identifier: 'day',
            elementType: 'select',
            elementConfig: {
              optionRange: {
                min: 1,
                max: 31,
              },
              value: 1,
              labelClasses: ['visually-hidden'],
              layoutClass: 'col-4 col-lg-3',
            },
            label: 'Day',
            validityErrors: [
              // 'valueMissing',
            ],
            valid: true,
            touched: false,
          },
          {
            // Year
            identifier: 'year',
            elementType: 'select',
            elementConfig: {
              optionRange: {
                min: 1900,
                max: 2010,
              },
              value: 1976,
              labelClasses: ['visually-hidden'],
              layoutClass: 'col-4 col-lg-3',
            },
            label: 'Year',
            validityErrors: [
              // 'valueMissing',
            ],
            valid: false,
            touched: false,
          }
        ],
      },
      label: 'Date of Birth',
      validityErrors: ['valueMissing'],
      valid: true,
      touched: false,
    },
    address1: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        value: '',
      },
      label: 'Mailing Address',
      validityErrors: [
        'valueMissing',
      ],
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
          defaultOptionLabel: '-- Choose your country',
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
  }

  const initialFormState = {
    formFields: {
      ...minimumFormFields,
    },
    valid: false,
    touched: false,
  }

  const [bowlerForm, setBowlerForm] = useState(initialFormState);
  const [fieldsToUse, setFieldsToUse] = useState(Object.keys(minimumFormFields));

  // Because this may be used by registering bowlers or by an admin adding a bowler
  const [buttonText, setButtonText] = useState(nextButtonText ? nextButtonText : 'Review');

  const additionalFormFields = (editing = false) => {
    const formFields = {};

    for (let key in tournament.additional_questions) {
      const q = tournament.additional_questions[key];
      formFields[key] = {...q}
      if (q.validation.required) {
        formFields[key].validityErrors = ['valueMissing'];
        formFields[key].valid = editing;
      } else {
        formFields[key].valid = true
      }
      formFields[key].touched = false;
      formFields[key].elementConfig = {...q.elementConfig}
    }
    return formFields;
  }

  const resetFormData = () => {
    const formData = {
      formFields: {
        ...minimumFormFields, // our minimum
        ...potentialFormFields, // plus any that the tournament enables
        ...additionalFormFields(), // plus any extras
        doublesPartner: null, // and a placeholder for a doubles partner
      },
      valid: false,
      touched: false,
    }

    // add doubles partner if there are any available
    if (availablePartners.length > 0) {
      const partnerChoices = availablePartners.map(partner => ({
        value: partner.identifier,
        label: partner.full_name,
      }));
      formData.formFields.doublesPartner = {
        elementType: 'radio-limited-set',
        elementConfig: {
          choices: [
            {
              value: '',
              label: 'unspecified',

            },
          ].concat(partnerChoices),
          value: '',
        },
        label: 'Doubles Partner',
        valid: true,
        touched: false,
      }
    }

    setBowlerForm(formData);
  }

  // set up the form data the way the tournament wants it
  useEffect(() => {
    if (!tournament) {
      return;
    }

    const bowlerFieldsItem = tournament.config_items.find(({key}) => key === 'bowler_form_fields');
    const optionalFields = !!bowlerFieldsItem ? bowlerFieldsItem.value : [];

    resetFormData();
    const updatedFields = fieldsToUse.concat(optionalFields).concat(Object.keys(tournament.additional_questions));
    setFieldsToUse(updatedFields);
  }, [tournament]);

  // We're editing a bowler. Put their data into the form.
  useEffect(() => {
    if (!bowlerData || !tournament) {
      return;
    }
    const updatedBowlerForm = {...bowlerForm};
    updatedBowlerForm.formFields = {
      ...updatedBowlerForm.formFields,
      ...additionalFormFields(true),
    };

    // all the standard fields and additional questions
    for (const inputName in bowlerData) {
      if (!updatedBowlerForm.formFields[inputName]) {
        continue;
      }
      updatedBowlerForm.formFields[inputName].elementConfig.value = bowlerData[inputName];
    }

    // add the date-of-birth combo elements
    if (bowlerForm.formFields.date_of_birth) {
      const dobObj = updatedBowlerForm.formFields.date_of_birth;

      bowlerForm.formFields.date_of_birth.elementConfig.elements.forEach((elem, index) => {
        const key = `birth_${elem.identifier}`;
        dobObj.elementConfig.elements[index].elementConfig.value = bowlerData[key];
      });
    }

    updatedBowlerForm.valid = true;

    setBowlerForm(updatedBowlerForm);
    if (!nextButtonText) {
      setButtonText('Review Changes');
    }
  }, [bowlerData, tournament]);

  if (!tournament) {
    return '';
  }

  const formHandler = (event) => {
    event.preventDefault();

    if (!bowlerForm.valid) {
      return;
    }

    // Grab all the values from the form so they can be stored
    const theBowlerData = {};
    for (let formElementIdentifier in bowlerForm.formFields) {
      if (bowlerForm.formFields[formElementIdentifier] === null) {
        continue;
      }
      theBowlerData[formElementIdentifier] = bowlerForm.formFields[formElementIdentifier].elementConfig.value;
    }

    // add the date-of-birth combo elements
    if (bowlerForm.formFields.date_of_birth) {
      bowlerForm.formFields.date_of_birth.elementConfig.elements.forEach(elem => {
        const key = `birth_${elem.identifier}`;
        theBowlerData[key] = elem.elementConfig.value;
      });
    }

    // Reset the form to take in the next bowler's info
    resetFormData();

    bowlerInfoSaved(theBowlerData);
  }

  const validityForField = (failedChecks = []) => {
    return {
      validated: true,
      valid: failedChecks.length === 0,
      validityFailures: failedChecks,
    }
  }

  const inputChangedHandler = (event) => {
    let inputName;
    if (event.target) {
      inputName = event.target.name;
    } else {
      inputName = 'country';
    }

    // Create a copy of the bowler form; this is where we'll make updates
    const updatedBowlerForm = {
      ...bowlerForm,
      // Deep-copy the formFields property, because it's complex
      formFields: { ...bowlerForm.formFields },
    };

    let failedChecks, checksToRun, validity;
    // Note: this may be a combo element, so don't do any other deep-copying of its elementConfig
    let updatedFormElement;
    switch (inputName) {
      case 'country':
        updatedFormElement = {
          ...bowlerForm.formFields[inputName],
          elementConfig: {
            ...bowlerForm.formFields[inputName].elementConfig,
            value: event,
          },
        }

        failedChecks = event.length === 0 ? ['valueMissing'] : [];
        updatedFormElement = {
          ...updatedFormElement,
          ...validityForField(failedChecks),
        }
        break;
      case 'date_of_birth:month':
      case 'date_of_birth:day':
        const [comboIdentifier, elemIdentifier] = inputName.split(':');

        // month or day
        const index = elemIdentifier === 'month' ? 0 : 1;
        const dobElem = bowlerForm.formFields[comboIdentifier].elementConfig.elements[index];

        updatedFormElement = {
          ...dobElem,
          elementConfig: {
            ...dobElem.elementConfig,
            value: event.target.value,
          },
          touched: true,
        }

        updatedBowlerForm.formFields[comboIdentifier].elementConfig.elements[index] = updatedFormElement;
        break;
      default:
        checksToRun = bowlerForm.formFields[inputName].validityErrors;
        validity = !!checksToRun ? event.target.validity : {};
        failedChecks = !!checksToRun ? checksToRun.filter(c => validity[c]) : [];

        updatedFormElement = {
          ...bowlerForm.formFields[inputName],
          elementConfig: {...bowlerForm.formFields[inputName].elementConfig},
          validated: false,
          ...validityForField(failedChecks)
        }
        if (bowlerForm.formFields[inputName].elementType === 'checkbox') {
          updatedFormElement.elementConfig.value = event.target.checked ? 'yes' : 'no';
        }  else {
          updatedFormElement.elementConfig.value = event.target.value;
        }
        break;
    }

    updatedFormElement.touched = true;

    // put the updated form element in the updated form
    // if it's not one of the combo elements
    if (!['date_of_birth:month', 'date_of_birth:day'].includes(inputName)) {
      updatedBowlerForm.formFields[inputName] = updatedFormElement;
    }

    updatedBowlerForm.touched = true;

    // Now, determine whether the whole form is valid
    updatedBowlerForm.valid = Object.values(updatedBowlerForm.formFields).every(
      formField => {
        return formField === null || typeof formField.valid === 'undefined' || formField.valid
      }
    );

    // Replace the form in state, to reflect changes based on the value that changed, and resulting validity
    setBowlerForm(updatedBowlerForm);
  }

  const bonusValidityCheck = (inputName, inputElement, value) => {
    // Doing this specifically for email addresses rather than opting for a generic
    // approach, since emails are, so far, the only input field for which we want
    // validation beyond the Validation API

    // Only do this on active tournaments
    if (['demo', 'testing', 'active'].includes(tournament.state) && inputName === 'email') {
      const newFormData = {...bowlerForm};
      newFormData.formFields[inputName].bonusCheckUnderway = true;

      devConsoleLog("Let's validate an email!");
      validateEmail(value).then(result => {
        if (!result.checked) {
          devConsoleLog("I did not actually check it.");
        }

        if (result.error) {
          // Right now, we don't care if it returns an error; this is an enhancement,
          // not a requisite check.
        } else {
          const whoopsies = [];

          // result.rejected will be true if Verifalia's check bame back as Undeliverable.
          if (result.rejected) {
            // This is for the Input component
            whoopsies.push('undeliverable');

            // This is for the Constraint Validation API (which sets the :invalid pseudo-class)
            inputElement.setCustomValidity('undeliverable');
          } else {
            inputElement.setCustomValidity('');
          }

          newFormData.formFields[inputName] = {
            ...newFormData.formFields[inputName],
            ...validityForField(whoopsies),
          }
        }
      }).catch(error => {
        devConsoleLog("Unexpected error: ", error);
      }).then(() => {
        newFormData.formFields[inputName].bonusCheckUnderway = false;
        setBowlerForm(newFormData);
      });
    }
  }

  const fieldBlurred = (event, inputName) => {
    const newFormData = {...bowlerForm}
    const fieldIsChanged = newFormData.formFields[inputName].touched;

    const checksToRun = bowlerForm.formFields[inputName].validityErrors;
    if (!checksToRun || !fieldIsChanged) {
      // Don't update validations if we've blurred but the input was never changed
      return;
    }

    const {validity} = event !== null ? event.target : {};
    const failedChecks = checksToRun.filter(c => validity[c]);

    // If everything in the Validation API passed, then run any bonus checks
    if (failedChecks.length === 0) {
      bonusValidityCheck(inputName, event.target, newFormData.formFields[inputName].elementConfig.value);
    }

    newFormData.formFields[inputName] = {
      ...newFormData.formFields[inputName],
      ...validityForField(failedChecks),
    };

    // Now, determine whether the whole form is valid
    newFormData.valid = Object.values(newFormData.formFields).every(
      formField => formField === null  || typeof formField.valid === 'undefined' || formField.valid
    );

    setBowlerForm(newFormData);
  }

  const formElements = [];
  fieldsToUse.forEach(key => {
    if (bowlerForm.formFields[key]) {
      formElements.push({
        id: key,
        setup: bowlerForm.formFields[key],
        // <select> elements get excluded, since onChange covers it
        validateOnBlur: !!bowlerForm.formFields[key].validityErrors && key !== 'country' && bowlerForm.formFields[key].elementType !== 'select',
      });
    }
  });

  let form = (
    <form onSubmit={formHandler}>
      {formElements.map(formElement => (
        <Input
          key={formElement.id}
          identifier={formElement.id}
          elementType={formElement.setup.elementType}
          elementConfig={formElement.setup.elementConfig}
          changed={inputChangedHandler}
          label={formElement.setup.label}
          helper={formElement.setup.helper}
          validityErrors={formElement.setup.validityErrors}
          errorMessages={formElement.setup.errorMessages}
          // For <select> elements, onBlur is redundant to onChange
          blurred={formElement.validateOnBlur ? (event) => fieldBlurred(event, formElement.id) : false}
          failedValidations={typeof formElement.setup.validityFailures !== 'undefined' ? formElement.setup.validityFailures : []}
          wasValidated={formElement.setup.validated}
          loading={!!formElement.setup.bonusCheckUnderway}
        />
      ))}

      <div className="d-flex flex-row-reverse justify-content-between pt-2">
        <button className="btn btn-primary btn-lg" type="submit" disabled={!bowlerForm.valid}>
          {buttonText}{' '}
          <i className="bi bi-chevron-double-right ps-1" aria-hidden="true"/>
        </button>
      </div>
    </form>
  );

  return (
    <ErrorBoundary>
      <div className={classes.BowlerForm}>

        <p className={`${classes.RequiredLabel} text-md-center`}>
          <i className={`align-top bi-asterisk`}/>
          {' '}indicates a required field
        </p>

        {form}
      </div>
    </ErrorBoundary>
  );
}

export default BowlerForm;
