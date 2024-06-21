import React, {useEffect, useState} from "react";
import {CountryDropdown} from "react-country-region-selector";
// import { AddressAutofill } from '@mapbox/search-js-react';

import Input from "../../ui/Input/Input";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './BowlerForm.module.scss';
import {devConsoleLog} from "../../../utils";

import dynamic from 'next/dynamic';
const AddressAutofill = dynamic(
  () => import("@mapbox/search-js-react").then((mod) => mod.AddressAutofill),
  { ssr: false }
);

const BowlerForm = ({tournament, bowlerInfoSaved, bowlerData, availablePartners = [], nextButtonText, showShifts = false}) => {
  const DATE_OF_BIRTH_FIELDS = [
    'birth_month',
    'birth_day',
    'birth_year',
  ];

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
            },
            labelClasses: ['visually-hidden'],
            layoutClass: 'col-4 col-xl-3',
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
            labelClasses: ['visually-hidden'],
            layoutClass: 'col-4 col-xl-3',
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
            },
            labelClasses: ['visually-hidden'],
            layoutClass: 'col-4 col-xl-3',
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
        autoComplete: 'address-line1',
      },
      label: 'Mailing Address',
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
        autoComplete: 'address-line2',
      },
      label: 'Unit / Apt No.',
      validityErrors: [
        '',
      ],
      valid: true,
      touched: false,
    },
    city: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        value: '',
        autoComplete: 'address-level2',
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
        autoComplete: 'address-level1',
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
        value: 'US',
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
        autoComplete: 'postal-code',
      },
      label: 'ZIP/Postal Code',
      validityErrors: [
        'valueMissing',
      ],
      valid: true,
      touched: false,
    },
    shift_identifier: {
      elementType: 'select',
      elementConfig: {
        options: [], // Pull these from the tournament in an effect
        value: '',
      },
      label: 'Shift Preference',
      validityErrors: [
        'valueMissing',
      ],
      valid: true,
      touched: false,
    },
    payment_app: {
      elementType: 'combo',
      elementConfig: {
        elements: [
          {
            // App name
            identifier: 'app_name',
            elementType: 'select',
            elementConfig: {
              options: [
                {
                  value: '',
                  label: ' --',
                },
                {
                  value: 'PayPal',
                  label: 'PayPal',
                },
                {
                  value: 'Venmo',
                  label: 'Venmo',
                },
                {
                  value: 'Zelle',
                  label: 'Zelle',
                },
                // {
                //   value: 'cashapp',
                //   label: 'CashApp',
                // },
                // {
                //   value: 'googlepay',
                //   label: 'Google Pay',
                // },
                // {
                //   value: 'applepay',
                //   label: 'Apple Pay',
                // },
                // {
                //   value: 'samsungpay',
                //   label: 'Samsung Pay',
                // },
              ],
              value: 'paypal',
            },
            labelClasses: ['visually-hidden'],
            layoutClass: 'col-5 col-md-4 col-xl-3',
            label: 'App Name',
            validityErrors: [
            ],
            valid: true,
            touched: false,
          },
          {
            // Account name
            identifier: 'account_name',
            elementType: 'input',
            elementConfig: {
              type: 'text',
              value: '',
              placeholder: '@username / email / phone',
            },
            layoutClass: 'col',
            labelClasses: ['visually-hidden'],
            label: 'Account Name',
            validityErrors: [
              // 'valueMissing',
            ],
            valid: true,
            touched: false,
          }
        ],
      },
      label: 'Payment App',
      helper: {
        text: 'The tournament will try to pay you this way, rather than mail a check',
      },
      validityErrors: [],
      valid: true,
      touched: false,
    }
  }

  const [bowlerForm, setBowlerForm] = useState();
  const [fieldsToUse, setFieldsToUse] = useState(new Set(Object.keys(minimumFormFields)));

  // Because this may be used by registering bowlers or by an admin adding a bowler
  const [buttonText, setButtonText] = useState(nextButtonText ? nextButtonText : 'Review');

  const additionalFormFields = () => {
    const formFields = {};

    tournament.additionalQuestions.forEach(q => {
      const key = q.name;
      formFields[key] = {...q}
      if (q.validation.required) {
        formFields[key].validityErrors = ['valueMissing'];
        formFields[key].valid = !!bowlerData;
      } else {
        formFields[key].valid = true
      }
      formFields[key].touched = false;
      formFields[key].elementConfig = {...q.elementConfig}
    });
    return formFields;
  }

  const getInitialFormData = (listOfFieldsToUse) => {
    const formData = {
      formFields: {
        ...minimumFormFields, // our minimum
        ...potentialFormFields, // plus any that the tournament enables
        ...additionalFormFields(), // plus any extras
      },
      valid: false,
      touched: false,
    }

    // add doubles partner if there are any available (and if the tournament has a doubles event)
    const hasDoublesEvent = tournament.events.some(({rosterType}) => rosterType === 'double');
    if (hasDoublesEvent && availablePartners.length > 0) {
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
      listOfFieldsToUse.add('doubles_partner');
    }

    setFieldsToUse(listOfFieldsToUse);

    return formData;
  }

  // Fill in the given structure with existing form data.
  // Pre-requisite: bowlerData exists
  const getPopulatedFormData = (formData) => {
    const updatedBowlerForm = {
      ...formData,
      valid: true,
      touched: false,
    };

    // fill most of the form data
    for (const inputName in formData.formFields) {
      // skip the DOB and payment app fields, do them separately
      if (!DATE_OF_BIRTH_FIELDS.includes(inputName)) {
        updatedBowlerForm.formFields[inputName].elementConfig.value = bowlerData[inputName];
      }
    }

    // now do the DOB fields
    const dobObj = updatedBowlerForm.formFields.date_of_birth;
    formData.formFields.date_of_birth.elementConfig.elements.forEach((elem, index) => {
      const key = `birth_${elem.identifier}`;
      dobObj.elementConfig.elements[index].elementConfig.value = bowlerData[key];
    });

    // and now do the payment app fields
    const paymentObj = updatedBowlerForm.formFields.payment_app;
    formData.formFields.payment_app.elementConfig.elements.forEach((elem, index) => {
      paymentObj.elementConfig.elements[index].elementConfig.value = bowlerData.payment_app[elem.identifier];
    });

    return updatedBowlerForm;
  }

  // set up the form to reflect any optional fields and additional questions,
  // plus shifts on a non-standard tournament, if applicable
  useEffect(() => {
    if (!tournament) {
      return;
    }

    const optionalFields = tournament.config.bowler_form_fields.split(' ');

    const updatedFields = new Set(fieldsToUse);
    optionalFields.concat(tournament.additionalQuestions.map(aq => aq.name)).forEach(field => updatedFields.add(field));

    if (showShifts) {
      updatedFields.add('shift_identifier');
    }

    const initialFormData = getInitialFormData(updatedFields);

    // Make sure we populate the shift options only once.
    if (showShifts && initialFormData.formFields.shift_identifier.elementConfig.options.length === 0) {
      const firstAvailableShift = tournament.shifts.find(({isFull}) => !isFull);
      initialFormData.formFields.shift_identifier.elementConfig.value = firstAvailableShift.identifier;
      tournament.shifts.forEach((shift) => {
        if (!shift.isFull) {
          initialFormData.formFields.shift_identifier.elementConfig.options.push({value: shift.identifier, label: shift.name});
        }
      });
    }

    if (bowlerData) {
      const populatedFormData = getPopulatedFormData(initialFormData);
      setBowlerForm(populatedFormData);

      if (!nextButtonText) {
        setButtonText('Review Changes');
      }
    } else {
      setBowlerForm(initialFormData);
    }
  }, [tournament]);

  if (!tournament || !bowlerForm) {
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
      if (typeof bowlerForm.formFields[formElementIdentifier].elementConfig.value !== 'undefined') {
        theBowlerData[formElementIdentifier] = bowlerForm.formFields[formElementIdentifier].elementConfig.value;
      }
    }

    // add the date-of-birth combo elements
    if (fieldsToUse.has('date_of_birth')) {
      bowlerForm.formFields.date_of_birth.elementConfig.elements.forEach(elem => {
        const key = `birth_${elem.identifier}`;
        theBowlerData[key] = elem.elementConfig.value;
      });
    }

    // add the payment app combo elements
    if (fieldsToUse.has('payment_app')) {
      // only two elements, and the order should be consistent, but
      // perhaps it's better not to rely on the element order
      theBowlerData.payment_app = {};
      bowlerForm.formFields.payment_app.elementConfig.elements.forEach(elem => {
        theBowlerData.payment_app[elem.identifier] = elem.elementConfig.value;
      });
    }

    devConsoleLog("Bowler data:", theBowlerData);

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
      inputName = event.target.name.split(' ')[0];
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
      case 'date_of_birth:year':
        const elemIdentifier = inputName.split(':')[1];

        const elems = [
          'month',
          'day',
          'year',
        ];
        const index = elems.findIndex(e => e === elemIdentifier);
        const dobElem = bowlerForm.formFields.date_of_birth.elementConfig.elements[index];

        updatedFormElement = {
          ...dobElem,
          elementConfig: {
            ...dobElem.elementConfig,
            value: event.target.value,
          },
          touched: true,
        }

        updatedBowlerForm.formFields.date_of_birth.elementConfig.elements[index] = updatedFormElement;
        break;
      case 'payment_app:app_name':
      case 'payment_app:account_name':
        const paymentElemIdentifier = inputName.split(':')[1];

        const elements = [
          'app_name',
          'account_name',
        ];
        const elemIndex = elements.findIndex(e => e === paymentElemIdentifier);
        const paymentElem = bowlerForm.formFields.payment_app.elementConfig.elements[elemIndex];

        updatedFormElement = {
          ...paymentElem,
          elementConfig: {
            ...paymentElem.elementConfig,
            value: event.target.value,
          },
          touched: true,
        }

        updatedBowlerForm.formFields.payment_app.elementConfig.elements[elemIndex] = updatedFormElement;
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
    const comboInputs = [
      'date_of_birth:month',
      'date_of_birth:day',
      'date_of_birth:year',
      'payment_app:app_name',
      'payment_app:account_name',
    ];
    if (!comboInputs.includes(inputName)) {
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

  const theme = {
    variables: {
      fontFamily: "var(--tournio-font-sans-serif)",
      colorBackground: "var(--tournio-body-bg)",
      colorBackgroundHover: "var(--tournio-secondary-bg-subtle)",
      colorText: "var(--tournio-body-color)",
    }
  };

  let form = (
    <form onSubmit={formHandler}>
      {formElements.map(formElement => {
        if (formElement.id === 'address1') {
          return (
            <AddressAutofill key={'address-autofill'} accessToken={'pk.eyJ1IjoidG91cm5pbyIsImEiOiJjbHhtZXh4ZDIwMnI5MmlwdGo4aW5rdXk2In0.DR6SCOSPoaXUIXfondtzfA'} theme={theme}>
              <Input
                identifier={formElement.id}
                elementType={formElement.setup.elementType}
                elementConfig={formElement.setup.elementConfig}
                changed={inputChangedHandler}
                label={formElement.setup.label}
                labelClasses={formElement.setup.labelClasses}
                layoutClass={formElement.setup.layoutClass}
                helper={formElement.setup.helper}
                validityErrors={formElement.setup.validityErrors}
                errorMessages={formElement.setup.errorMessages}
                // For <select> elements, onBlur is redundant to onChange
                blurred={formElement.validateOnBlur ? (event) => fieldBlurred(event, formElement.id) : false}
                failedValidations={typeof formElement.setup.validityFailures !== 'undefined' ? formElement.setup.validityFailures : []}
                wasValidated={formElement.setup.validated}
                loading={!!formElement.setup.bonusCheckUnderway}
              />
            </AddressAutofill>
          )
        } else {
          return (
            <Input
              key={formElement.id}
              identifier={formElement.id}
              elementType={formElement.setup.elementType}
              elementConfig={formElement.setup.elementConfig}
              changed={inputChangedHandler}
              label={formElement.setup.label}
              labelClasses={formElement.setup.labelClasses}
              layoutClass={formElement.setup.layoutClass}
              helper={formElement.setup.helper}
              validityErrors={formElement.setup.validityErrors}
              errorMessages={formElement.setup.errorMessages}
              // For <select> elements, onBlur is redundant to onChange
              blurred={formElement.validateOnBlur ? (event) => fieldBlurred(event, formElement.id) : false}
              failedValidations={typeof formElement.setup.validityFailures !== 'undefined' ? formElement.setup.validityFailures : []}
              wasValidated={formElement.setup.validated}
              loading={!!formElement.setup.bonusCheckUnderway}
            />
          )
        }
      })}

      <p className={`${classes.RequiredLabel} text-md-center`}>
        <i className={`align-top bi-asterisk`}/>
        {' '}indicates a required field
      </p>

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
        {form}
      </div>
    </ErrorBoundary>
  );
}

export default BowlerForm;
