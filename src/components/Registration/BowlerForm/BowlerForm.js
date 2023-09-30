import React, {useEffect, useState} from "react";
import {CountryDropdown} from "react-country-region-selector";

import Input from "../../ui/Input/Input";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ErrorBoundary from "../../common/ErrorBoundary";
import {devConsoleLog, validateEmail} from "../../../utils";

import classes from './BowlerForm.module.scss';
import {isNil} from "voca/internal/is_nil";

const BowlerForm = ({tournament, bowlerInfoSaved, bowlerData, availablePartners = []}) => {
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
              },
              label: 'Day',
              validityErrors: [
                'valueMissing',
              ],
              valid: true,
              touched: false,
            },
          ],
        },
        label: 'Date of Birth',
        validityErrors: [],
        valid: true,
        touched: false,
      },
      // birth_month: {
      //   elementType: 'select',
      //   elementConfig: {
      //     options: [
      //       {
      //         value: '',
      //         label: '-- Choose your month',
      //       },
      //       {
      //         value: 1,
      //         label: 'Jan'
      //       },
      //       {
      //         value: 2,
      //         label: 'Feb'
      //       },
      //       {
      //         value: 3,
      //         label: 'Mar'
      //       },
      //       {
      //         value: 4,
      //         label: 'Apr'
      //       },
      //       {
      //         value: 5,
      //         label: 'May'
      //       },
      //       {
      //         value: 6,
      //         label: 'Jun'
      //       },
      //       {
      //         value: 7,
      //         label: 'Jul'
      //       },
      //       {
      //         value: 8,
      //         label: 'Aug'
      //       },
      //       {
      //         value: 9,
      //         label: 'Sep'
      //       },
      //       {
      //         value: 10,
      //         label: 'Oct'
      //       },
      //       {
      //         value: 11,
      //         label: 'Nov'
      //       },
      //       {
      //         value: 12,
      //         label: 'Dec'
      //       },
      //     ],
      //     value: '',
      //   },
      //   label: 'Birth month',
      //   validityErrors: [
      //     'valueMissing',
      //   ],
      //   valid: true,
      //   touched: false,
      // },
      // birth_day: {
      //   elementType: 'input',
      //   elementConfig: {
      //     type: 'number',
      //     value: '',
      //     min: 1,
      //     max: 31,
      //   },
      //   label: 'Birth day',
      //   validityErrors: [
      //     'valueMissing',
      //     'rangeUnderflow',
      //     'rangeOverflow',
      //     'typeMismatch',
      //   ],
      //   valid: true,
      //   touched: false,
      // },
      doubles_partner: null,
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
          undeliverable: "This address is marked as Undeliverable. Are you sure you have it right?"
        },
        bonusCheckUnderway: false,
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
    },
    valid: false,
    touched: false,
    soloBowlerFields: {
    }
  }
  const [bowlerForm, setBowlerForm] = useState(initialFormState);
  const [buttonText, setButtonText] = useState('Review');

  const additionalFormFields = (editing = false) => {
    const formFields = {};
    for (let key in tournament.additional_questions) {
      formFields[key] = {...tournament.additional_questions[key]}
      if (tournament.additional_questions[key].validation.required) {
        formFields[key].validityErrors = ['valueMissing'];
        formFields[key].valid = editing;
      } else {
        formFields[key].valid = true
      }
      formFields[key].touched = false;
      formFields[key].elementConfig = {...tournament.additional_questions[key].elementConfig}
    }
    return formFields;
  }

  const resetFormData = (tourn) => {
    const formData = {...initialFormState};

    // add doubles partner if there are any available
    if (availablePartners.length > 0) {
      const partnerChoices = availablePartners.map(partner => ({
        value: partner.identifier,
        label: partner.full_name,
      }));
      formData.formFields.doubles_partner = {
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

    // get the additional questions
    formData.formFields = {...formData.formFields, ...additionalFormFields()};

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
    updatedBowlerForm.formFields = {
      ...updatedBowlerForm.formFields,
      ...additionalFormFields(true),
    };

    // First, all the standard fields and additional questions
    for (const inputIdentifier in bowlerData) {
      if (!updatedBowlerForm.formFields[inputIdentifier]) {
        continue;
      }
      updatedBowlerForm.formFields[inputIdentifier].elementConfig.value = bowlerData[inputIdentifier];
    }

    updatedBowlerForm.valid = true;

    setBowlerForm(updatedBowlerForm);
    setButtonText('Review Changes');
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
    const theBowlerData = {};
    for (let formElementIdentifier in bowlerForm.formFields) {
      if (bowlerForm.formFields[formElementIdentifier] === null) {
        continue;
      }
      theBowlerData[formElementIdentifier] = bowlerForm.formFields[formElementIdentifier].elementConfig.value;
    }

    // Reset the form to take in the next bowler's info
    resetFormData(tournament);

    bowlerInfoSaved(theBowlerData);
  }

  const validityForField = (failedChecks = []) => {
    return {
      validated: true,
      valid: failedChecks.length === 0,
      validityFailures: failedChecks,
    }
  }

  const inputChangedHandler = (event, inputIdentifier, elemIndex = -1) => {
    devConsoleLog("input identifier: ", inputIdentifier);
    devConsoleLog("Verification of elemIndex: ", elemIndex);

    // Create a copy of the bowler form; this is where we'll make updates
    const updatedBowlerForm = {
      ...bowlerForm,
      // Deep-copy the formFields property, because it's complex
      formFields: { ...bowlerForm.formFields },
    };

    // Our special snowflakes for the new value:
    let newValue;
    if (inputIdentifier === 'country')
      newValue = event;
    else if (bowlerForm.formFields[inputIdentifier].elementType === 'checkbox') {
      newValue = event.target.checked ? 'yes' : 'no';
    } else {
      newValue = event.target.value;
    }

    // We need to go ahead and do validation for <select> elements, since their value isn't modified
    // between a change event (what we're reacting to here) and a blur event (which is for fieldBlurred)
    let failedChecks, checksToRun, validity;
    // Note: this may be a combo element, so don't do any other deep-copying of its elementConfig
    let updatedFormElement;
    const [comboIdentifier, elemIdentifier] = inputIdentifier.split(':');
    switch (inputIdentifier) {
      case 'country':
        updatedFormElement = {
          ...bowlerForm.formFields[inputIdentifier],
          elementConfig: {...bowlerForm.formFields[inputIdentifier].elementConfig},
        }

        failedChecks = event.length === 0 ? ['valueMissing'] : [];
        updatedFormElement = {
          ...updatedFormElement,
          ...validityForField(failedChecks),
        }
        break;
      case 'date_of_birth:month':
      case 'date_of_birth:day':
        // month or day
        const dobElem = bowlerForm.formFields[comboIdentifier].elementConfig.elements[elemIndex];

        updatedFormElement = {
          ...dobElem,
          elementConfig: {...dobElem.elementConfig},
        }

        checksToRun = dobElem.validityErrors;
        validity = event !== null ? event.target.validity : {};
        failedChecks = checksToRun.filter(c => validity[c]);
        updatedFormElement = {
          ...updatedFormElement,
          ...validityForField(failedChecks),
        }
        break;
      default:
        checksToRun = bowlerForm.formFields[inputIdentifier].validityErrors;
        validity = event.target.validity;
        failedChecks = checksToRun.filter(c => validity[c]);

        updatedFormElement = {
          ...bowlerForm.formFields[inputIdentifier],
          elementConfig: {...bowlerForm.formFields[inputIdentifier].elementConfig},
          ...validityForField(failedChecks)
        }
        break;
    }

    updatedFormElement.elementConfig.value = newValue;
    updatedFormElement.touched = true;

    // put the updated form element in the updated form
    if (['date_of_birth:month', 'date_of_birth:day'].includes(inputIdentifier)) {
      // if it's one of the combo elements
      updatedBowlerForm.formFields[comboIdentifier].elementConfig.elements[elemIndex] = updatedFormElement;
    } else {
      // if it's not one of the combo elements
      updatedBowlerForm.formFields[inputIdentifier] = updatedFormElement;
    }

    updatedBowlerForm.touched = true;

    // Now, determine whether the whole form is valid
    // devConsoleLog("Form validity...")
    updatedBowlerForm.valid = Object.values(updatedBowlerForm.formFields).every(
      formField => {
        // devConsoleLog(`Field:`, isNil(formField) ? 'null' : `${formField.label} --> ${formField.valid}`);

        return formField === null || typeof formField.valid === 'undefined' || formField.valid
      }
    );

    // Replace the form in state, to reflect changes based on the value that changed, and resulting validity
    setBowlerForm(updatedBowlerForm);
  }

  const bonusValidityCheck = (inputIdentifier, inputElement, value) => {
    // Doing this specifically for email addresses rather than opting for a generic
    // approach, since emails are, so far, the only input field for which we want
    // validation beyond the Validation API

    // Only do this on active tournaments
    if (['demo', 'testing', 'active'].includes(tournament.state) && inputIdentifier === 'email') {
      const newFormData = {...bowlerForm};
      newFormData.formFields[inputIdentifier].bonusCheckUnderway = true;

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

          newFormData.formFields[inputIdentifier] = {
            ...newFormData.formFields[inputIdentifier],
            ...validityForField(whoopsies),
          }
        }
      }).catch(error => {
        devConsoleLog("Unexpected error: ", error);
      }).then(() => {
        newFormData.formFields[inputIdentifier].bonusCheckUnderway = false;
        setBowlerForm(newFormData);
      });
    }
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

    // If everything in the Validation API passed, then run any bonus checks
    if (failedChecks.length === 0) {
      bonusValidityCheck(inputIdentifier, event.target, newFormData.formFields[inputIdentifier].elementConfig.value);
    }

    newFormData.formFields[inputIdentifier] = {
      ...newFormData.formFields[inputIdentifier],
      ...validityForField(failedChecks),
    };

    // Now, determine whether the whole form is valid
    newFormData.valid = Object.values(newFormData.formFields).every(
      formField => formField === null  || typeof formField.valid === 'undefined' || formField.valid
    );

    setBowlerForm(newFormData);
  }

  const formElements = [];
  for (let key in bowlerForm.formFields) {
    if (!bowlerForm.formFields[key]) {
      continue;
    }
    formElements.push({
      id: key,
      setup: bowlerForm.formFields[key],
      // <select> elements get excluded, since onChange covers it
      validateOnBlur: !!bowlerForm.formFields[key].validityErrors && key !== 'country' && bowlerForm.formFields[key].elementType !== 'select',
    });
  }

  let form = (
    <form onSubmit={formHandler}>
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
