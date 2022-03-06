import {useState, useEffect, useMemo} from "react";
import {Button} from "react-bootstrap";
import {CountryDropdown} from 'react-country-region-selector';

import {useDirectorContext} from "../../../store/DirectorContext";
import Input from "../../ui/Input/Input";

import classes from './BowlerDetails.module.scss';

const bowlerDetails = ({bowler, bowlerUpdateSubmitted}) => {
  const directorContext = useDirectorContext();

  let tournament;
  if (directorContext && directorContext.tournament) {
    tournament = directorContext.tournament;
  }

  const initialFormData = {
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
        validation: {
          required: true,
        },
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
        validation: {
          required: false,
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
          text: 'Look up a USBC ID',
        },
        valid: true,
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
          required: false,
        },
        helper: {
          url: 'http://www.igbo.org/igbots-id-lookup/',
          text: 'Look up an IGBO ID',
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
        valid: true,
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
        validation: {
          required: true,
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
        validation: {
          required: true,
        },
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
        validation: {
          required: true,
        },
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
        validation: {
          required: true,
        },
        valid: true,
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
            defaultOptionLabel: "-- Choose the bowler's country",
            classes: 'form-control',
          },
        },
        label: 'Country',
        validation: {
          required: true,
        },
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
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
      },
    },
    valid: true,
    touched: false,
  }

  const [bowlerForm, setBowlerForm] = useState(initialFormData);

  // This effect populates the form data with the bowler's details,
  // which should happen only once.
  useEffect(() => {
    if (!bowler) {
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
  }, [bowler]);

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

  if (!bowler) {
    return '';
  }

  const formElements = [];
  for (let key in bowlerForm.formFields) {
    formElements.push({
      id: key,
      setup: bowlerForm.formFields[key],
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
            shouldValidate={true}
            touched={formElement.setup.touched}
            invalid={!formElement.setup.valid}
            helper={formElement.setup.helper}
            validationRules={formElement.setup.validation}
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

export default bowlerDetails;