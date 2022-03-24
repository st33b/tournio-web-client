import {useState, useEffect} from "react";

import ErrorBoundary from "../../common/ErrorBoundary";
import SingleUseForm from "./SingleUseForm";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './NewPurchasableItem.module.scss';

const NewPurchasableItem = () => {
  const context = useDirectorContext();

  const [formDisplayed, setFormDisplayed] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const allowCreate = context.tournament.state !== 'active';

  const addClicked = (event, formType) => {
    event.preventDefault();
    setFormDisplayed(formType);
  }

  const cancelClicked = () => {
    setFormDisplayed(null);
  }

  const itemSaved = (message) => {
    setSuccessMessage(message);
    setFormDisplayed(null);
  }

  const outerClass = formDisplayed ? classes.FormDisplayed : '';
  return (
    <ErrorBoundary>
      <div className={`${classes.NewPurchasableItem} ${outerClass}`}>
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

        {!formDisplayed && allowCreate &&
          <div className={'text-center my-3'}>
            <button type={'button'}
                    className={'btn btn-outline-primary'}
                    role={'button'}
                    onClick={(event) => addClicked(event, 'single_use')}>
              <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
              New Single-use Item
            </button>
          </div>
        }

        {formDisplayed === 'single_use' && <SingleUseForm onCancel={cancelClicked} onComplete={itemSaved} />}

      </div>
    </ErrorBoundary>
  )
}

export default NewPurchasableItem;