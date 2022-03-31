import classes from './ManualPayment.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";
import ErrorBoundary from "../../common/ErrorBoundary";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {directorApiRequest} from "../../../utils";

const ManualPayment = ({bowler, added}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const initialFormState = {
    amount: '',
    identifier: '',

    valid: false,
  }

  const [formDisplayed, setFormDisplayed] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  // Pre-populate the form with the amount that the bowler owes.
  useEffect(() => {
    if (!bowler) {
      return;
    }
    const newFormData = {...formData};
    newFormData.amount = bowler.amount_due;
    newFormData.valid = isFormValid(newFormData);
    setFormData(newFormData);
  }, [bowler]);

  const isFormValid = (data) => {
    return data.amount > 0;
  }

  const addClicked = () => {
    setFormDisplayed(true);
  }

  const cancelClicked = () => {
    setFormDisplayed(false);
  }

  const inputChanged = (event) => {
    const newValue = event.target.value;
    const newFormData = {...formData};
    newFormData[event.target.name] = newValue;
    newFormData.valid = isFormValid(newFormData);
    setFormData(newFormData);
  }

  const createSuccess = (data) => {
    const newLedgerEntry = data;
    added(newLedgerEntry);
    setSuccessMessage('Ledger Entry created');
    setFormDisplayed(false);
    setFormData(initialFormState);
  }

  const createFailure = (data) => {
    setErrorMessage(`Error: ${data.error}`);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = `/director/bowlers/${bowler.identifier}/ledger_entries`;
    const requestConfig = {
      method: 'post',
      data: {
        ledger_entry: {
          credit: formData.amount,
          identifier: formData.identifier,
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: createSuccess,
      onFailure: createFailure,
    });
  }

  return (
    <ErrorBoundary>
      <div className={`${classes.ManualPayment}`}>
        {formDisplayed && (
          <form className={`${classes.Form} px-3 py-3`} onSubmit={formSubmitted}>
            <div className={`${classes.HeaderRow} row mb-2`}>
              <h6>
                New Ledger Entry
              </h6>
            </div>
            <div className={'row mb-3 mx-0'}>
              <label htmlFor={'amount'}
                     className={'form-label'}>
                Amount (in $)
              </label>
              <input type={'number'}
                     id={'amount'}
                     name={'amount'}
                     className={'form-control'}
                     min={0}
                     value={formData.amount}
                     onChange={inputChanged}/>
            </div>
            <div className={'row mb-3 mx-0'}>
              <label htmlFor={'identifier'}
                     className={'form-label'}>
                Identifier/Note (optional)
              </label>
              <input type={'text'}
                     id={'identifier'}
                     name={'identifier'}
                     className={'form-control'}
                     value={formData.identifier}
                     onChange={inputChanged}/>
            </div>
            {errorMessage && (
              <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center m-3'}
                   role={'alert'}>
                <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
                <div className={'me-auto'}>
                  {errorMessage}
                  <button type="button"
                          className={"btn-close"}
                          data-bs-dismiss="alert"
                          onClick={() => setErrorMessage(null)}
                          aria-label="Close"/>
                </div>
              </div>
            )}
            <div className={'row mx-0'}>
              <div className={'d-flex justify-content-between p-0'}>
                <button type={'button'}
                        title={'Cancel'}
                        onClick={cancelClicked}
                        className={'btn btn-outline-danger'}>
                  <i className={'bi-x-lg pe-2'} aria-hidden={true}/>
                  Cancel
                </button>
                <button type={'submit'}
                        className={'btn btn-success'}
                        disabled={!formData.valid}>
                  Save
                  <i className={'bi-chevron-right ps-2'} aria-hidden={true}/>
                </button>
              </div>
            </div>
          </form>
        )}
        {successMessage && (
          <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center m-3'}
               role={'alert'}>
            <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
            <div className={'me-auto'}>
              {successMessage}
              <button type="button"
                      className={"btn-close"}
                      data-bs-dismiss="alert"
                      onClick={() => setSuccessMessage(null)}
                      aria-label="Close"/>
            </div>
          </div>
        )}
        {!formDisplayed && (
          <div className={'row my-3'}>
            <div className={'d-flex justify-content-center'}>
              <Button type={'button'}
                      variant={'outline-success'}
                      size={'sm'}
                      onClick={addClicked}>
                <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
                Add Manual Payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default ManualPayment;