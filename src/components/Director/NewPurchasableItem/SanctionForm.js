import {useState} from "react";

import ErrorBoundary from "../../common/ErrorBoundary";
import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import {purchasableItemsAdded} from "../../../store/actions/directorActions";

import classes from './SanctionForm.module.scss';
import {devConsoleLog} from "../../../utils";
import ButtonRow from "../../common/ButtonRow";
import {useLoginContext} from "../../../store/LoginContext";

const SanctionForm = ({tournament, onCancel, onComplete}) => {
  const {authToken} = useLoginContext();
  const {dispatch} = useDirectorContext();

  const initialState = {
    determination: '',
    name: '',
    value: '',
    order: '',

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);

  const supportedSanctions = {
    igbo: 'IGBO Membership',
    usbc: 'USBC Membership',
  }

  const inputChanged = (event) => {
    let newValue = '';
    newValue = event.target.value;
    const inputName = event.target.name;

    const newFormData = {...formData};

    if (inputName === 'value' || inputName === 'order') {
      if (newValue.length > 0) {
        newValue = parseInt(newValue);
      }
    } else {
      // it's determination, because that's all that's left
      newFormData.name = supportedSanctions[newValue];
    }

    newFormData[inputName] = newValue;
    newFormData.valid = newFormData.name.length > 0 && newFormData.value > 0 && newFormData.order > 0;

    setFormData(newFormData);
  }

  const submissionSuccess = (data) => {
    dispatch(purchasableItemsAdded(data));
    setFormData({...initialState});
    onComplete(`Item ${data[0].name} created.`);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = `/tournaments/${tournament.identifier}/purchasable_items`;
    const requestConfig = {
      method: 'post',
      data: {
        purchasable_items: [
          {
            category: 'sanction',
            determination: formData.determination,
            name: formData.name,
            value: formData.value,
            configuration: {
              order: formData.order,
            },
          },
        ],
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: submissionSuccess,
      onFailure: (_) => console.log("Failed to save new item."),
    });
  }

  return (
    <ErrorBoundary>
      <div className={classes.SanctionForm}>
        <form onSubmit={formSubmitted} className={`py-2`}>
          <div className={`${classes.HeaderRow} row mb-2`}>
            <h6>
              New Sanction Item
            </h6>
          </div>
          <div className={'row mb-3'}>
            <label htmlFor={'name'} className={'form-label col-3 text-end'}>
              Type
            </label>
            <div className={'col'}>
              {Object.keys(supportedSanctions).map(det => (
                <div className={'form-check'} key={det}>
                  <input className={'form-check-input'}
                         type={'radio'}
                         name={'determination'}
                         id={`determination_${det}`}
                         value={det}
                         onChange={inputChanged} />
                  <label className={'form-check-label'}
                         htmlFor={`determination_${det}`}>
                    {supportedSanctions[det]}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className={'row mb-3'}>
            <div className={'col-6 ps-0'}>
              <label htmlFor={'value'} className={'form-label ps-0 mb-1'}>
                Price
              </label>
              <input type={'number'}
                     className={`form-control`}
                     name={'value'}
                     id={'value'}
                     required={true}
                     onChange={(event) => inputChanged(event)}
                     value={formData.value}
              />
            </div>
            <div className={'col-6 pe-0'}>
              <label htmlFor={'order'} className={'form-label ps-0 mb-1'}>
                Display order
              </label>
              <input type={'number'}
                     className={`form-control`}
                     name={'order'}
                     id={'order'}
                     required={true}
                     onChange={(event) => inputChanged(event)}
                     value={formData.order}
              />
            </div>
          </div>

          <ButtonRow onCancel={onCancel} disableSave={!formData.valid} />
        </form>
      </div>
    </ErrorBoundary>
  );
}

export default SanctionForm;
