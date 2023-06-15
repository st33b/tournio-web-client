import {useEffect, useState} from "react";
import {ListGroupItem} from "react-bootstrap";

import ErrorBoundary from "../../common/ErrorBoundary";
import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";

import classes from './VisibleTournament.module.scss';
import {tournamentConfigItemChanged} from "../../../store/actions/directorActions";

const ConfigItemForm = ({item}) => {
  const { dispatch } = useDirectorContext();
  const { authToken } = useLoginContext();

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
      onSuccess: (ci) => {dispatch(tournamentConfigItemChanged(ci))},
      onFailure: (data) => { console.log("Failed to save config item.", data) },
    });
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
                 onChange={onInputChanged} />
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
