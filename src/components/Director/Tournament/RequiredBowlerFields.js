import {useEffect, useState} from 'react';
import {Accordion} from "react-bootstrap";

import {directorApiRequest, useTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import ErrorAlert from "../../common/ErrorAlert";
import {updateObject} from "../../../utils";

const RequiredBowlerFields = () => {
  const { authToken } = useLoginContext();
  const {tournament, tournamentUpdatedQuietly} = useTournament();

  const initialFormData = {
    birth_month: {
      label: 'Birth Month',
      required: false,
    },
    birth_day: {
      label: 'Birth Day',
      required: false,
    },
    birth_year: {
      label: 'Birth Year',
      required: false,
    },
    address1: {
      label: 'Street Address',
      required: false,
    },
    city: {
      label: 'City',
      required: false,
    },
    state: {
      label: 'State',
      required: false,
    },
    country: {
      label: 'Country',
      required: false,
    },
    postal_code: {
      label: 'Postal Code',
      required: false,
    },
    usbc_id: {
      label: 'USBC ID',
      required: false,
    },
  }

  const [configItemId, setConfigItemId] = useState();
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState(null);

  // Populate form data with what the tournament already has, and disable
  // the ones that don't apply for the tournament type
  useEffect(() => {
    if (!tournament) {
      return;
    }
    const configItem = tournament.config_items.find(({key}) => key === 'bowler_form_fields');
    const requiredFields = configItem.value;

    const newFormData = {...formData};
    for (const itemKey in formData) {
      newFormData[itemKey].required = requiredFields.includes(itemKey);
    }
    setFormData(newFormData);
    setConfigItemId(configItem.id);
  }, [tournament]);

  if (!tournament) {
    return '';
  }

  const optionToggled = (event) => {
    const inputName = event.target.name;
    const isRequired = event.target.checked;
    const newFormData = {...formData};
    newFormData[inputName].required = isRequired;
    setFormData(newFormData);

    submitBowlerFields(newFormData);
  }

  const submitBowlerFields = (options) => {
    const uri = `/config_items/${configItemId}`;
    const requestedFields = [];
    for (const field in options) {
      if (options[field].required) {
        requestedFields.push(field);
      }
    }
    const requestConfig = {
      method: 'patch',
      data: {
        config_item: {
          value: requestedFields.join(' '),
        },
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => submissionCompleted(data),
      onFailure: (data) => setErrorMessage(data.error),
    })
  }

  const submissionCompleted = (data) => {
    // Replace the old config item with this one
    const modifiedItems = [...tournament.config_items];
    const index = modifiedItems.findIndex(({key}) => key === 'bowler_form_fields');
    modifiedItems[index] = {...data};
    const updatedTournament = updateObject(tournament, {
      config_items: modifiedItems,
    });
    tournamentUpdatedQuietly(updatedTournament);
  }

  return (
    <div>
      <Accordion className={`mb-3`} defaultActiveKey={"0"}>
        <Accordion.Item eventKey={"0"}>
          <Accordion.Header as={"h5"}>
            Bowler Form Fields
          </Accordion.Header>
          <Accordion.Body>
            <p>
              The registration form will require that bowlers enter this information.
            </p>
            {Object.keys(formData).map(key => (
              <div className={'form-check form-switch'} key={key}>
                <input type={'checkbox'}
                       className={'form-check-input'}
                       role={'switch'}
                       id={`require_${key}`}
                       name={key}
                       checked={formData[key].required}
                       onChange={optionToggled}/>
                <label htmlFor={`require_${key}`}
                       className={'form-check-label'}>
                  {formData[key].label}
                </label>
              </div>
            ))}
            <ErrorAlert message={errorMessage}
                        className={`mx-3`}
                        onClose={() => setErrorMessage(null)}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default RequiredBowlerFields;
