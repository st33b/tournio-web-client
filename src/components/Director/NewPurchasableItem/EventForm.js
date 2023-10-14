import {useState} from "react";
import ButtonRow from "../../common/ButtonRow";

import ErrorBoundary from "../../common/ErrorBoundary";
import {useLoginContext} from "../../../store/LoginContext";
import {directorApiRequest, useTournament} from "../../../director";

import classes from './EventForm.module.scss';

const EventForm = ({onCancel, onComplete}) => {
  const {authToken} = useLoginContext();
  const {tournament} = useTournament();

  const initialState = {
    category: 'bowling',
    determination: 'event',
    refinement: 'single',
    name: '',
    value: '',
    order: '',

    valid: false,
  }

  const refinementLabels = [
    ['single', 'Singles'],
    ['double', 'Doubles'],
    ['team', 'Team'],
    ['trio', 'Trios'],
  ];

  const [formData, setFormData] = useState(initialState);

  const inputChanged = (event) => {
    let newValue = '';
    newValue = event.target.value;
    const inputName = event.target.name;
    if (inputName === 'value' || inputName === 'order') {
      if (newValue.length > 0) {
        newValue = parseInt(newValue);
      }
    }
    const newFormData = {...formData};
    newFormData[inputName] = newValue;

    newFormData.valid = newFormData.name.length > 0 && newFormData.value > 0 && newFormData.order > 0;

    setFormData(newFormData);
  }

  const submissionSuccess = (data) => {
    setFormData({...initialState});
    onComplete(data);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = `/tournaments/${tournament.identifier}/purchasable_items`;
    const requestConfig = {
      method: 'post',
      data: {
        purchasable_items: [
          {
            category: formData.category,
            determination: formData.determination,
            refinement: formData.refinement,
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
      <div className={classes.EventForm}>
        <form onSubmit={formSubmitted} className={`py-2`}>
          <div className={`${classes.HeaderRow} row`}>
            <h6>
              New Core Event
            </h6>
            <small>For non-traditional tournaments</small>
          </div>
          <div className={'row mb-3'}>
            <label htmlFor={'name'} className={'form-label ps-0 mb-1'}>
              Name
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'name'}
                   id={'name'}
                   required={true}
                   onChange={(event) => inputChanged(event)}
                   value={formData.name}
            />
          </div>
          <div className={'row mb-3'}>
            <label htmlFor={'refinement'} className={'form-label ps-0 mb-1'}>
              Event Type
            </label>
            <select className={'form-select'}
                    name={'refinement'}
                    id={'refinement'}
                    required={true}
                    value={formData.refinement}
                    onChange={inputChanged}>
              {refinementLabels.map(r => {
                return (
                  <option value={r[0]}
                          key={r[0]}>
                    {r[1]}
                  </option>
                )}
              )}
            </select>
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

export default EventForm;
