import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Card from "react-bootstrap/Card";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './SingleUseForm.module.scss';
import {formatISO} from "date-fns";
import DateTimePicker from "@mui/lab/DateTimePicker";

const SingleItemForm = () => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialState = {
    category: 'bowling',
    determination: 'single_use',
    name: '',
    value: '',
    note: '', // division, product (optional)
    order: '',

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [formDisplayed, setFormDisplayed] = useState(false);
  const [alertMessage, setAlertMessage] = useState({success: '', error: ''});

  const allowCreate = context.tournament.state !== 'active';
  if (!allowCreate) {
    return '';
  }

  const addClicked = (event) => {
    event.preventDefault();
    setFormDisplayed(true);
  }

  const inputChanged = (event) => {
    let newValue = '';
    newValue = event.target.value;
    const inputName = event.target.name;
    if (inputName === 'value' || inputName ==='order') {
      newValue = parseInt(newValue);
    }
    const newFormData = {...formData};
    newFormData[inputName] = newValue;

    newFormData.valid = newFormData.name.length > 0 && newFormData.value > 0 && newFormData.order > 0;

    setFormData(newFormData);
  }

  const submissionSuccess = (data) => {
    setFormData({...initialState});
    setFormDisplayed(false);
    setAlertMessage({ success: 'New item saved.' });
    // context.setTournament(data);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = `/director/tournaments/${context.tournament.identifier}/purchasable_items`;
    const requestConfig = {
      method: 'post',
      data: {
        purchasable_item: {
          category: formData.category,
          determination: formData.determination,
          name: formData.name,
          value: formData.value,
          configuration: {
            order: formData.order,
            note: formData.note,
          }
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: submissionSuccess,
      onFailure: (_) => { console.log("Failed to save new item.") },
    });
  }

  const outerClass = formDisplayed ? classes.FormDisplayed : '';
  return (
    <div className={classes.SingleUseForm}>
      <Card.Body className={outerClass}>
        {formDisplayed &&
          <form onSubmit={formSubmitted} className={`${classes.Form} mx-2`}>
            <div className={`${classes.HeaderRow} row mb-2`}>
              <h6>
                New Single-Use Item
              </h6>
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
            <div className={'row mb-3'}>
              <label htmlFor={'note'} className={'form-label ps-0 mb-1'}>
                Note (optional)
              </label>
              <input type={'text'}
                     className={`form-control`}
                     name={'note'}
                     id={'note'}
                     onChange={(event) => inputChanged(event)}
                     value={formData.note}
              />
            </div>
            <div className={'row'}>
              <div className={'d-flex justify-content-between p-0'}>
                <button type={'button'}
                        title={'Cancel'}
                        onClick={() => setFormDisplayed(false) }
                        className={'btn btn-outline-danger'}>
                  <i className={'bi-x-lg pe-2'} aria-hidden={true} />
                  Cancel
                </button>
                <button type={'submit'}
                        title={'Save'}
                        disabled={!formData.valid}
                        className={'btn btn-success'}>
                  Save
                  <i className={'bi-chevron-right ps-2'} aria-hidden={true} />
                </button>
              </div>
            </div>
          </form>
        }
        {!formDisplayed && allowCreate &&
          <div className={'text-center'}>
            <button type={'button'}
                    className={'btn btn-outline-primary'}
                    role={'button'}
                    onClick={addClicked}>
              <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
              New Single-use Item
            </button>
          </div>
        }
        {!allowCreate &&
          <div className={'text-center'}
               title={'Cannot add items once registration is open'}>
            <button type={'button'}
                    className={'btn btn-outline-secondary'}
                    disabled
                    role={'button'}>
              <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
              New Single-use Item
            </button>
          </div>
        }
        {alertMessage.success && (
          <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
            <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
            <div className={'me-auto'}>
              {alertMessage.success}
              <button type="button"
                      className={"btn-close"}
                      data-bs-dismiss="alert"
                      onClick={() => setAlertMessage({success: ''})}
                      aria-label="Close" />
            </div>
          </div>
        )}
      </Card.Body>
    </div>
  );
}

export default SingleItemForm;