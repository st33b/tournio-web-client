import {useEffect, useState} from "react";
import {ListGroupItem} from "react-bootstrap";

import ErrorBoundary from "../../common/ErrorBoundary";
import {directorApiRequest, useTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";

import classes from './VisibleTournament.module.scss';
import {updateObject} from "../../../utils";

const ConfigItemForm = ({item}) => {
  const {authToken} = useLoginContext();
  const {tournament, tournamentUpdatedQuietly} = useTournament();

  const initialState = {
    prevValue: '',
    value: '',
    valid: true,
  }

  const [formData, setFormData] = useState(initialState);
  useEffect(() => {
    if (!item) {
      return;
    }
    const newFormData = {...formData}
    newFormData.value = item.value;
    newFormData.prevValue = item.value;
    setFormData(newFormData);
  }, [item]);

  if (!item) {
    return '';
  }

  const onInputChanged = (event) => {
    const newFormData = {...formData};
    newFormData.value = event.target.checked;
    setFormData(newFormData);

    const uri = `/config_items/${item.id}`;
    const requestConfig = {
      method: 'patch',
      data: {
        config_item: {
          value: newFormData.value,
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => itemUpdated(data),
      onFailure: (err) => {
        setErrorMessage(err.message)
      },
    });
  }

  const itemUpdated = (configItem) => {
    const newConfigItems = [...tournament.config_items];
    newConfigItems.filter(({id}) => id === configItem.id).forEach(ci => ci.value = configItem.value);
    const updatedTournament = updateObject(tournament, {
      config_items: newConfigItems,
    });

    tournamentUpdatedQuietly(updatedTournament);
  }

  return (
    <ListGroupItem className={`${classes.ConfigItemForm}`} key={item.key}>
      <ErrorBoundary>
        <div className={'form-check form-switch'}>
          <input type={'checkbox'}
                 className={'form-check-input'}
                 role={'switch'}
                 name={'config_item'}
                 id={item.key}
                 checked={formData.value}
                 onChange={onInputChanged}/>
          <label className={'form-check-label'}
                 htmlFor={item.key}>
            {item.label}
          </label>
        </div>
      </ErrorBoundary>
    </ListGroupItem>
  );
}

export default ConfigItemForm;
