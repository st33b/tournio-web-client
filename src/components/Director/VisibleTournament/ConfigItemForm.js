import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ListGroupItem} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './VisibleTournament.module.scss';

const ConfigItemForm = ({item}) => {
  const context = useDirectorContext();
  const router = useRouter();

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

    const uri = `/director/config_items/${item.id}`;
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
      context: context,
      router: router,
      onSuccess: (_) => {},
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