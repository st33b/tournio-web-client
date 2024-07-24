import Input from "../../ui/Input/Input";
import React, {useState, useEffect} from "react";
import {CountryDropdown} from "react-country-region-selector";
import titleCase from "voca/title_case";

import classes from './DumbBowlerForm.module.scss';

import dynamic from 'next/dynamic';
import {devConsoleLog, updateObject} from "../../../utils";
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
        valid: !!bowler,
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
        validityErrors: [],
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
        valid: !!bowler,
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
        valid: !!bowler,
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
        valid: !!bowler,
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
        valid: !!bowler,
        touched: false,
      },
      dateOfBirth: {
        elementType: 'combo',
        identifier: 'dateOfBirth',
        elementConfig: {
          elementOrder: [
            'birthMonth',
            'birthDay',
            'birthYear',
          ],
          elements: {
            birthMonth: {
              // Month
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
            birthDay: {
              // Day
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
              ],
              valid: true,
              touched: false,
            },
            birthYear: {
              // Year
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
              valid: true,
              touched: false,
            },
          },
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
        valid: !!bowler,
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
        validityErrors: [],
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
        valid: !!bowler,
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
        valid: !!bowler,
        touched: false,
      },
      country: {
        elementType: 'component',
        elementConfig: {
          // autoComplete: 'country', // (this component is not compatible with autoComplete)
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
        valid: !!bowler,
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
        valid: !!bowler,
        touched: false,
      },
      paymentApp: {
        elementType: 'combo',
        elementConfig: {
          elementOrder: [
            'paymentApp',
            'paymentAccount',
          ],
          elements: {
            paymentApp: {
              // App name
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
                ],
                value: '',
              },
              labelClasses: ['visually-hidden'],
              layoutClass: 'col-5 col-md-4 col-xl-3',
              label: 'App Name',
              validityErrors: [],
              valid: true,
              touched: false,
            },
            paymentAccount: {
              // Account name
              elementType: 'input',
              elementConfig: {
                type: 'text',
                value: '',
                placeholder: '@username / email / phone',
              },
              layoutClass: 'col',
              labelClasses: ['visually-hidden'],
              label: 'Account Name',
              validityErrors: [],
              valid: true,
              touched: false,
            },
          },
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

          value: '',
        },
        label: 'Position',
        validityErrors: [
          'valueMissing',
        ],
        valid: true,
        touched: false,
      },
      // TODO: use the two shift forms for shift identifier(s)
      // shiftIdentifiers: {
      //   elementType: 'select',
      //   elementConfig: {
      //     // Filled by data in fieldData
      //     options: [],
      //     value: [],
      //   },
      //   label: 'Shift Preference',
      //   validityErrors: [
      //     'valueMissing',
      //   ],
      //   valid: true,
      //   touched: false,
      // },

      pronouns: {
        elementType: 'select',
        elementConfig: {
          value: '',
          placeholder: '',
          options: [
            {label: "-- Indicate your pronouns", value: ""},
            {label: "he/him", value: "he/him"},
            {label: "she/her", value: "she/her"},
            {label: "they/them", value: "they/them"},
            {label: "something else (let us know!)", value: "something else"},
          ],
        },
        label: 'Personal Pronouns',
        validityErrors: [],
        valid: !!bowler,
        touched: false,
      },
      dietary: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Any dietary restrictions we should know about?',
        helper: {
          url: '',
          text: 'vegetarian / vegan / allergies / etc.',
        },
        validityErrors: [],
        valid: true,
        touched: false,
      },
      comment: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Anything else we should know?',
        validityErrors: [],
        valid: !!bowler,
        touched: false,
      },
      standingsLink: {
        elementType: 'input',
        elementConfig: {
          type: 'url',
          value: '',
          placeholder: '',
        },
        label: 'URL of current league standing sheet',
        helper: {
          url: '',
          text: '',
        },
        validityErrors: [],
        valid: !!bowler,
        touched: false,
      },
      enteringAverage: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          value: '',
          min: 0,
          max: 300,
        },
        label: 'Entering Average',
        helper: {
          url: '',
          text: 'See tournament rules for details',
        },
        validityErrors: [],
        valid: !!bowler,
        touched: false,
      },
      shirtSize: {
        elementType: 'select',
        elementConfig: {
          value: '',
          placeholder: '',
          options: [
            {label: "-- Indicate your shirt size", value: ""},
            {label: "Men's XS", value: "men's xs"},
            {label: "Men's S", value: "men's s"},
            {label: "Men's M", value: "men's m"},
            {label: "Men's L", value: "men's l"},
            {label: "Men's XL", value: "men's xl"},
            {label: "Men's 2XL", value: "men's 2xl"},
            {label: "Men's 3XL", value: "men's 3xl"},
            {label: "Men's 4XL", value: "men's 4xl"},
            {label: "Women's XS", value: "women's xs"},
            {label: "Women's S", value: "women's s"},
            {label: "Women's M", value: "women's m"},
            {label: "Women's L", value: "women's l"},
            {label: "Women's XL", value: "women's xl"},
            {label: "Women's 2XL", value: "women's 2xl"},
            {label: "Women's 3XL", value: "women's 3xl"},
            {label: "Women's 4XL", value: "women's 4xl"},
            {label: "Other (please let us know!)", value: "other"}
          ],
        },
        label: 'Shirt Size',
        helper: {
          url: '',
          text: '',
        },
        validityErrors: [],
        valid: !!bowler,
        touched: false,
      },
      shirtSizeUnisex: {
        elementType: 'select',
        elementConfig: {
          value: '',
          placeholder: '',
          options: [
            {label: "-- Indicate your shirt size", value: ""},
            {label: "XS", value: "xs"},
            {label: "S", value: "s"},
            {label: "M", value: "m"},
            {label: "L", value: "l"},
            {label: "XL", value: "xl"},
            {label: "2XL", value: "2xl"},
            {label: "3XL", value: "3xl"},
            {label: "4XL", value: "4xl"},
            {label: "Other (please let us know!)", value: "other"}
          ],
        },
        label: 'Shirt Size (Unisex)',
        helper: {
          url: '',
          text: '',
        },
        validityErrors: [],
        valid: !!bowler,
        touched: false,
      },
      volunteerWhileNotBowling: {
        elementType: 'checkbox',
        elementConfig: {
          label: 'Yes',
          value: 'no'
        },
        label: "Are you able to volunteer when you're not bowling?",
        helper: {
          url: '',
          text: '',
        },
        validityErrors: [],
        valid: true,
        touched: false,
      },
      stayingAtHostHotel: {
        elementType: 'checkbox',
        elementConfig: {
          label: 'Yes',
          value: 'no'
        },
        label: "Do you plan to stay at the host hotel?",
        helper: {
          url: '',
          text: '',
        },
        validityErrors: [],
        valid: true,
        touched: false,
      },
      igboRep: {
        elementType: 'checkbox',
        elementConfig: {
          label: 'Yes',
          value: 'no'
        },
        label: "Are you an IGBO Representative for a league or tournament?",
        validityErrors: [],
        valid: true,
        touched: false,
      },
      nonparticipantNames: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Names of any non-bowlers coming with you',
        helper: {
          url: '',
          text: '(attending the banquet, etc.)',
        },
        validityErrors: [],
        valid: true,
        touched: false,
      },
      igboTadAverage: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          value: '',
          min: 0,
          max: 300,
        },
        label: 'IGBO TAD Average',
        helper: {
          url: '',
          text: 'See tournament rules for details',
        },
        validityErrors: [],
        valid: !!bowler,
        touched: false,
      },
      hasFreeEntry: {
        elementType: 'checkbox',
        elementConfig: {
          label: '',
          value: 'no',
        },
        label: 'I have a free entry',
        validityErrors: [],
        valid: true,
        touched: false,
      },
      firstTime: {
        elementType: 'checkbox',
        elementConfig: {
          label: 'Yes',
          value: 'no',
        },
        label: 'Is this your first time attending this tournament?',
        validityErrors: [],
        valid: true,
        touched: false,
      },
      igboLeagueAndState: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          value: '',
        },
        label: 'Name and state of IGBO league, if any',
        validityErrors: [],
        valid: true,
        touched: false,
      },

      // Having this allows us to hang on to the doubles partner assignment across edits
      doublesPartnerIndex: {
        elementType: 'none',
        elementConfig: {
          value: -1,
        },
        label: 'Doubles Partner',
        validityErrors: [],
        valid: true,
        touched: false,
      }
    },
    valid: !!bowler,
    touched: false,
  }
  const [formData, setFormData] = useState(initialFormData);

  // populate the form with bowler data, if there is one.
  useEffect(() => {
    const modifiedFormData = {
      fields: {
        ...formData.fields,
      },
      valid: true,
      touched: false,
    }

    // a bowler making changes, or an admin viewing a bowler's data, so populate the form
    // with values from the bowler prop
    if (bowler) {
      for (const fieldName in formData.fields) {
        switch(fieldName) {
          case 'dateOfBirth':
          case 'paymentApp':
            modifiedFormData.fields[fieldName].elementConfig.elements = [];
            // push a copy of the initial elements, this time containing a value for each
            initialFormData.fields[fieldName].elementConfig.elements.forEach(elem => {
              modifiedFormData.fields[fieldName].elementConfig.elements.push({
                ...elem,
                elementConfig: updateObject(elem.elementConfig, {
                  value: bowler[elem.identifier]
                }),
              });
            });
            break;
          default:
            modifiedFormData.fields[fieldName].elementConfig.value = bowler[fieldName];
            break;
        }
      }
    }

    setFormData(modifiedFormData);
  }, [bowler]);

  if (!tournament) {
    return '';
  }

  ////////////////////////

  // Resets all values in the form data.
  const clearFormData = () => {
    const newFormData = {
      fields: {
        ...initialFormData.fields,
        ...getAdditionalQuestionFields(),
      },
      valid: false,
      touched: false,
    }
    setFormData(newFormData);
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
    devConsoleLog("change handler:", inputName);

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
      case 'birthMonth':
      case 'birthDay':
      case 'birthYear':
        const dobElem = formData.fields.dateOfBirth.elementConfig.elements[inputName];

        updatedFormElement = {
          ...dobElem,
          elementConfig: {
            ...dobElem.elementConfig,
            value: event.target.value,
          },
          touched: true,
        }

        updatedBowlerForm.fields.dateOfBirth.elementConfig.elements[inputName] = updatedFormElement;
        break;
      case 'paymentApp':
      case 'paymentAccount':
        const paymentElem = formData.fields.paymentApp.elementConfig.elements[inputName];

        updatedFormElement = {
          ...paymentElem,
          elementConfig: {
            ...paymentElem.elementConfig,
            value: event.target.value,
          },
          touched: true,
        }

        updatedBowlerForm.fields.paymentApp.elementConfig.elements[inputName] = updatedFormElement;
        break;
      default:
        checksToRun = formData.fields[inputName].validityErrors;
        validity = !!checksToRun ? event.target.validity : {};
        failedChecks = !!checksToRun ? checksToRun.filter(c => validity[c]) : [];

        updatedFormElement = {
          ...formData.fields[inputName],
          elementConfig: {...formData.fields[inputName].elementConfig},
          validated: false,
          ...validityForField(failedChecks)
        }
        if (formData.fields[inputName].elementType === 'checkbox') {
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
      'paymentApp:app',
      'paymentApp:account',
    ];
    if (!comboInputs.includes(inputName)) {
      updatedBowlerForm.fields[inputName] = updatedFormElement;
    }

    updatedBowlerForm.touched = true;

    // Is the whole form valid?
    updatedBowlerForm.valid = fieldNames.every(fieldName => updatedBowlerForm.fields[fieldName].valid);

    setFormData(updatedBowlerForm);
  }

  const fieldBlurred = (event, inputName) => {
    devConsoleLog("Field blurred:", inputName)
  //
  //   const newFormData = {...formData}
  //   const fieldIsChanged = formData.fields[inputName].touched;
  //
  //   const checksToRun = formData.fields[inputName].validityErrors;
  //   if (!checksToRun || !fieldIsChanged) {
  //     // Don't update validations if we've blurred but the input was never changed
  //     return;
  //   }
  //
  //   const {validity} = event !== null ? event.target : {};
  //   const failedChecks = checksToRun.filter(c => validity[c]);
  //
  //   newFormData.fields[inputName] = {
  //     ...newFormData.fields[inputName],
  //     ...validityForField(failedChecks),
  //   };
  //
  //   // Now, determine whether the whole form is valid
  //   newFormData.valid = fieldNames.every(fieldName => newFormData.fields[fieldName].valid);
  //
  //   setFormData(newFormData);
  }

  const formSubmitted = (event) => {
    event.preventDefault();

    if (!formData.valid) {
      return;
    }

    const bowlerData = {};
    for (let identifier in formData.fields) {
      // Pull in everything where the value is not undefined.
      // This gets everything except what's in combo elements.
      if (typeof formData.fields[identifier].elementConfig.value !== 'undefined') {
        bowlerData[identifier] = formData.fields[identifier].elementConfig.value;
      }

      // Now get the fields in combo elements, if needed.
      if (fieldNames.includes('dateOfBirth')) {
        formData.fields.dateOfBirth.elementConfig.elements.forEach(elem => {
          const key = 'birth' + titleCase(elem.identifier);
          bowlerData[key] = elem.elementConfig.value;
        });
      }

      // And payment app
      if (fieldNames.includes('paymentApp')) {
        formData.fields.paymentApp.elementConfig.elements.forEach(elem => {
          const key = 'payment' + titleCase(elem.identifier);
          bowlerData[key] = elem.elementConfig.value;
        });
      }
    }

    devConsoleLog("Saving bowler data:", bowlerData);
    onBowlerSave(bowlerData);

    // Now, clear the form out to make room for the next bowler.
    clearFormData();
  }

  const mapboxTheme = {
    variables: {
      fontFamily: "var(--tournio-font-sans-serif)",
      colorBackground: "var(--tournio-body-bg)",
      colorBackgroundHover: "var(--tournio-secondary-bg-subtle)",
      colorText: "var(--tournio-body-color)",
    }
  };

  const inputElementForField = (fieldName) => {
    // We may not have details for the field: additional questions, or the caller is
    // attempting to render a field we don't (yet) know about.
    if (!formData.fields[fieldName]) {
      return null;
    }

    const formElement = formData.fields[fieldName];
    const validateOnBlur = formData.fields[fieldName].elementType !== 'select' && formData.fields[fieldName].validityErrors.length > 0;

    return (
      <Input
        key={`input_${fieldName}`}
        identifier={fieldName}
        elementType={formElement.elementType}
        elementConfig={formElement.elementConfig}
        changed={inputChangedHandler}
        label={formElement.label}
        labelClasses={formElement.labelClasses}
        layoutClass={formElement.layoutClass}
        helper={formElement.helper}
        validityErrors={formElement.validityErrors}
        errorMessages={formElement.errorMessages}
        // For <select> elements, onBlur is redundant to onChange
        blurred={validateOnBlur ? (event) => fieldBlurred(event, fieldName) : false}
        // formElement.validityFailures is added by validityForField
        failedValidations={typeof formElement.validityFailures !== 'undefined' ? formElement.validityFailures : []}
        wasValidated={formElement.validated}
      />
    );
  }

  return (
    <div className={classes.DumbBowlerForm}>
      <form onSubmit={formSubmitted}>
        {fieldNames.map(fieldName => {
          if (fieldName === 'address1') {
            return (
              <AddressAutofill key={'address-autofill'}
                               accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
                               theme={mapboxTheme}>
                {inputElementForField(fieldName)}
              </AddressAutofill>
            )
          }
          return inputElementForField(fieldName);
        })}

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
