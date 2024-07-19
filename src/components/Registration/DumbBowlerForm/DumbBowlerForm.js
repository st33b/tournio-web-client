import Input from "../../ui/Input/Input";
import React, {useState} from "react";
import {CountryDropdown} from "react-country-region-selector";

import classes from './DumbBowlerForm.module.scss';

import dynamic from 'next/dynamic';
const AddressAutofill = dynamic(
  () => import("@mapbox/search-js-react").then((mod) => mod.AddressAutofill),
  { ssr: false }
);

const DumbBowlerForm = ({
  tournament,
  bowler,
  onBowlerSave,
  solo = false,
  submitButtonText = 'Next',
  fieldNames = ['firstName', 'lastName', 'nickname', 'email', 'phone'], // specifies which of the fields we know about to use
  fieldData = {}, // things that cannot be known at compile time, such as taken positions or values/labels for shifts
                        }) => {
  const initialFormData = {
    fields: {
      firstName: {
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
      lastName: {
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

      usbcId: {
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
      dateOfBirth: {
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
        label: 'City/Town',
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
      postalCode: {
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
      paymentApp: {
        elementType: 'combo',
        elementConfig: {
          elements: [
            {
              // App name
              identifier: 'appName',
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
              identifier: 'accountName',
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
      },

      position: {
        elementType: 'radio',
        elementConfig: {
          // Filled by data in fieldData
          // choices: [],

          // Filled by data in fieldData (or bowler, which takes precedence for edits)
          // value: 0,
        },
        label: 'Position',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
      shiftIdentifiers: {
        elementType: 'select',
        elementConfig: {
          // Filled by data in fieldData
          options: [],
          value: [],
        },
        label: 'Shift Preference',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },

      // Having this allows us to hang on to the doubles partner assignment across edits
      doublesPartnerIndex: {
        elementType: 'none',
        elementConfig: {
          value: null,
        },
        label: 'Doubles Partner',
        valid: true,
        touched: false,
      }
    },
    valid: false,
    touched: false,
  }
  const [formData, setFormData] = useState(initialFormData);

  // Ok, now how to handle editing a bowler? Does it make sense for that to happen in useEffect?

  if (!tournament) {
    return '';
  }

  ////////////////////////

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
      ...formData,
      // Deep(ish)-copy the fields property, because it's complex
      fields: { ...formData.fields },
    };

    let failedChecks, checksToRun, validity;

    // Note: this may be a combo element, so don't do any other deep-copying of its elementConfig
    let updatedFormElement;

    switch (inputName) {
      case 'country':
        failedChecks = event.length === 0 ? ['valueMissing'] : [];
        updatedFormElement = {
          ...formData.fields.country,
          elementConfig: {
            ...formData.fields.country.elementConfig,
            value: event,
          },
          ...validityForField(failedChecks),
        }
        break;
      case 'dateOfBirth:month':
      case 'dateOfBirth:day':
      case 'dateOfBirth:year':
        const elemIdentifier = inputName.split(':')[1];

        const elems = [
          'month',
          'day',
          'year',
        ];
        const index = elems.findIndex(e => e === elemIdentifier);
        const dobElem = formData.fields.dateOfBirth.elementConfig.elements[index];

        updatedFormElement = {
          ...dobElem,
          elementConfig: {
            ...dobElem.elementConfig,
            value: event.target.value,
          },
          touched: true,
        }

        updatedBowlerForm.formFields.dateOfBirth.elementConfig.elements[index] = updatedFormElement;
        break;
      case 'paymentApp:appName':
      case 'paymentApp:accountName':
        const paymentElemIdentifier = inputName.split(':')[1];

        const elements = [
          'appName',
          'accountName',
        ];
        const elemIndex = elements.findIndex(e => e === paymentElemIdentifier);
        const paymentElem = formData.fields.paymentApp.elementConfig.elements[elemIndex];

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
        if (bowlerForm.fields[inputName].elementType === 'checkbox') {
          updatedFormElement.elementConfig.value = event.target.checked ? 'yes' : 'no';
        } else if (inputName === 'position') {
          updatedFormElement.elementConfig.value = parseInt(event.target.value);
        } else {
          updatedFormElement.elementConfig.value = event.target.value;
        }
        break;
    }

    updatedFormElement.touched = true;

    // put the updated form element in the updated form
    // if it's not one of the combo elements
    const comboInputs = [
      'dateOfBirth:month',
      'dateOfBirth:day',
      'dateOfBirth:year',
      'paymentApp:appName',
      'paymentApp:accountName',
    ];
    if (!comboInputs.includes(inputName)) {
      updatedBowlerForm.fields[inputName] = updatedFormElement;
    }

    updatedBowlerForm.touched = true;

    // Now, determine whether the whole form is valid
    updatedBowlerForm.valid = Object.values(updatedBowlerForm.fields).every(
      formField => {
        return formField === null || typeof formField.valid === 'undefined' || formField.valid
      }
    );

    // Replace the form in state, to reflect changes based on the value that changed, and resulting validity
    setFormData(updatedBowlerForm);
  }


  return (
    <div className={classes.DumbBowlerForm}>
      <form onSubmit={onBowlerSave}>

        <p className={`${classes.RequiredLabel} text-md-center`}>
          <i className={`align-top bi-asterisk pe-1`}/>
          indicates a required field
        </p>

        <div className="d-flex flex-row-reverse justify-content-between pt-2">
          <button className="btn btn-primary btn-lg" type="submit" disabled={!formData.valid}>
            {submitButtonText}
            <i className="bi bi-chevron-double-right ps-2" aria-hidden="true"/>
          </button>
        </div>
      </form>
    </div>
  );
}

export default DumbBowlerForm;
