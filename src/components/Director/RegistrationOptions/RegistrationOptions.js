import {useEffect, useState} from 'react';
import {Card} from "react-bootstrap";
import {Map} from 'immutable';

import {directorApiRequest, useTournament} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";
import {tournamentDetailsRetrieved} from "../../../store/actions/directorActions";
import {devConsoleLog} from "../../../utils";
import {useLoginContext} from "../../../store/LoginContext";
import ErrorAlert from "../../common/ErrorAlert";

const RegistrationOptions = () => {
  const { dispatch } = useDirectorContext();
  const { authToken } = useLoginContext();
  const {loading, tournament, tournamentUpdated} = useTournament();

  const REGISTRATION_TYPES = ['new_team', 'solo', 'join_team', 'partner', 'new_pair'];
  const REGISTRATION_TYPE_LABELS = [
    {key: 'new_team', label: 'New Teams'},
    {key: 'solo', label: 'Solo Entries'},
    {key: 'join_team', label: 'Join a Team'},
    {key: 'partner', label: 'Partner Up'},
    {key: 'new_pair', label: 'New Doubles Pair'},
  ];
  const TYPE_OPTIONS = {
    traditional: {
      new_team: true,
      solo: true,
      join_team: true,
      partner: false,
      new_pair: false,
    },
    eventsSelectable: {
      new_team: false,
      solo: true,
      join_team: false,
      partner: true,
      new_pair: true,
    },
  }

  const initialFormData = Map({
    new_team: false,
    join_team: true,
    solo: true,
    partner: false,
    new_pair: false,
  });

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState(null);

  // Populate form data with what the tournament already has
  useEffect(() => {
    if (!tournament) {
      return;
    }
    const newFormData = formData.withMutations(map => {
      REGISTRATION_TYPES.forEach(rType => {
        map.set(rType, tournament.registration_options[rType]);
      });
    });
    setFormData(Map(newFormData));
  }, [tournament]);

  if (!tournament) {
    return '';
  }

  const allowedOptionSet = tournament.event_items.event.length > 0 ? TYPE_OPTIONS.eventsSelectable : TYPE_OPTIONS.traditional;

  const optionToggled = (event) => {
    const inputName = event.target.name;
    const newValue = event.target.checked;
    const newFormData = formData.set(inputName, newValue);
    setFormData(newFormData);
    submitRegistrationOptions(newFormData);
  }

  const submitRegistrationOptions = (options) => {
    const uri = `/tournaments/${tournament.identifier}`;
    const enabledTypes = [];
    REGISTRATION_TYPES.forEach(rType => {
      if (options.get(rType)) {
        enabledTypes.push(rType);
      }
    });
    const requestConfig = {
      method: 'patch',
      data: {
        tournament: {
          details: {
            enabled_registration_options: enabledTypes,
          },
        },
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: () => tournamentUpdated(),
      onFailure: (data) => setErrorMessage(data.error),
    })
  }

  return (
    <Card className={'mb-2'}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Registration Options
      </Card.Header>
      <Card.Body>
        {REGISTRATION_TYPE_LABELS.map(kind => {
            return !allowedOptionSet[kind.key] ? '' :
              <div className={'form-check form-switch'} key={kind.key}>
                <input type={'checkbox'}
                       className={'form-check-input'}
                       role={'switch'}
                       id={kind.key}
                       name={kind.key}
                       checked={formData.get(kind.key)}
                       onChange={optionToggled}/>
                <label htmlFor={kind.key}
                       className={'form-check-label'}>
                  {kind.label}
                </label>
              </div>
          })}

      </Card.Body>
      <ErrorAlert message={errorMessage}
                  className={`mx-3`}
                  onClose={() => setErrorMessage(null)}
                  />
    </Card>
  );
}

export default RegistrationOptions;
