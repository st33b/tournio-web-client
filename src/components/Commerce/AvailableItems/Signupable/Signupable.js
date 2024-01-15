import {useState} from "react";
import classes from "./Signupable.module.scss";
import ErrorBoundary from "../../../common/ErrorBoundary";
import {signupableStatusUpdated} from "../../../../store/actions/registrationActions";

const Signupable = ({item, added, preview, signupChanged}) => {
  const [processing, setProcessing] = useState(false);

  const addClickedHandler = (event) => {
    event.preventDefault();
    added(item);
  }

  let secondaryText = '';
  if (item.configuration) {
    if (item.configuration.quantity) {
      secondaryText = (
        <p className={classes.Secondary}>
          {item.configuration.quantity}
        </p>
      );
    }
  }
  let tertiaryText = '';
  if (item.configuration) {
    if (item.configuration.note) {
      tertiaryText = (
        <p className={classes.Note}>
          ({item.configuration.note})
        </p>
      );
    }
    if (item.configuration.division) {
      tertiaryText = (
        <p className={classes.Note}>
          Division: {item.configuration.division}
          {item.configuration.note && <span>&nbsp;({item.configuration.note})</span>}
        </p>
      );
    } else if (item.configuration.input_label) {
      tertiaryText = (
        <form>
          <label>
            {item.configuration.input_label}
          </label>
          <input type={'text'} />
        </form>
      );
    }
  }

  let attachedClasses = [classes.Signupable, 'mb-3', 'mx-0', 'd-flex'];
  if (item.determination === 'event') {
    attachedClasses.push('border-primary', 'border-3');
  }
  let tooltipText = `Tap or click the icon link to add this item's fee to your bag`;
  if (item.signupStatus === 'paid' || item.addedToCart) {
    attachedClasses.push(classes.Selected);
    tooltipText = 'This item has been chosen';
  } else {
    attachedClasses.push(classes.NotSelected);
  }

  const changeProcessed = () => {
    setProcessing(false);
  }

  const changeFailed = (error) => {
    setProcessing(false);
  }

  const signupClicked = (event) => {
    event.preventDefault();
    setProcessing(true);
    signupChanged(item.signupIdentifier, 'request', changeProcessed, changeFailed);
  }

  const neverMindClicked = (event) => {
    event.preventDefault();
    setProcessing(true);
    signupChanged(item.signupIdentifier, 'never_mind', changeProcessed, changeFailed);
  }

  let signupAction = (
    <div className={`form-check`}>
      <input type={'checkbox'}
             aria-label={'Sign up'}
             id={`signupAction_${item.identifier}`}
             className={'form-check-input'}
             onClick={signupClicked}
      />
      <label className={`form-check-label ${classes.SignupLink}`}
             htmlFor={`signupAction_${item.identifier}`}
      >
        Sign up
      </label>
    </div>
  );

  const neverMindAction = (
    <div className={`form-check`}>
      <input type={'checkbox'}
             aria-label={'Back out'}
             id={`neverMindAction_${item.identifier}`}
             className={'form-check-input'}
             defaultChecked={true}
             onClick={neverMindClicked}
             disabled={!!item.addedToCart}
      />
      <label className={`form-check-label ${classes.SignupLink}`}
             htmlFor={`neverMindAction_${item.identifier}}`}
      >
        Sign up
      </label>
    </div>
  );

  const paidDisplay = (
    <div className={`form-check`}>
      <input type={'checkbox'}
             aria-label={'Paid'}
             id={`paidDisplay_${item.identifier}`}
             className={'form-check-input'}
             defaultChecked={true}
             readOnly={true}
             disabled={true}
      />
      <label className={`form-check-label ${classes.SignupLink}`}
             htmlFor={`paidDisplay_${item.identifier}}`}
      >
        Sign up
      </label>
    </div>
  );

  let addLink = '';
  if (item.signupStatus === 'requested' && !item.addedToCart) {
    addLink = (
      <a href={'#'}
         onClick={addClickedHandler}
         className={`${classes.AddLink} d-block ms-auto my-auto pe-2`}>
        <i className={`bi-cart-plus-fill`} />
        <span className={'visually-hidden'}>Add</span>
      </a>
    )
  }

  if (item.signupStatus === 'paid') {
    tooltipText = `You've paid for this, so signing up cannot be undone.`;
  }

  return (
    <ErrorBoundary>
      <div className={attachedClasses.join(' ')} title={tooltipText}>
        <div className={'ps-2'}>
          <p className={classes.Name}>
            {item.name}
          </p>
          {secondaryText}
          {tertiaryText}
          <p className={classes.Price}>
            ${item.value}
          </p>
          {!processing && (
            <div className={'pb-2'}>
              {item.signupStatus === 'initial' && signupAction}
              {item.signupStatus === 'requested' && neverMindAction}
              {item.signupStatus === 'paid' && paidDisplay}
            </div>
          )}
          {processing && (
            <div className={'spinner-border text-secondary mb-2'} role={'status'}>
              <span className={'visually-hidden'}>Processing...</span>
            </div>
          )}
        </div>
        {addLink}
      </div>
    </ErrorBoundary>
  );
}

export default Signupable;
