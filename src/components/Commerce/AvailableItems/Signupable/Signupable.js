import {useState} from "react";
import classes from "./Signupable.module.scss";
import ErrorBoundary from "../../../common/ErrorBoundary";

const Signupable = ({item, disableUnpaidSignup, added, signupChanged}) => {
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

  let tooltipText;

  if (item.siblingSignedUp) {
    attachedClasses.push(classes.Selected);
    tooltipText = 'You have signed up for this item in another division.';
  } else {
    if (disableUnpaidSignup) {
      switch (item.signupStatus) {
        case 'initial':
        case 'requested': // This shouldn't normally happen, but it could happen in testing/setup
          tooltipText = `Tap or click the icon link to add this item's fee to your cart.`;
          if (item.determination === 'multi_use') {
            if (item.quantity > 0) {
              tooltipText = 'This item is in your cart.';
              attachedClasses.push(classes.NotSelected);
            }
          } else {
            if (item.addedToCart) {
              tooltipText = 'This item is in your cart.';
              attachedClasses.push(classes.Selected);
            } else {
              attachedClasses.push(classes.NotSelected);
            }
          }
          break;
        case 'paid':
          tooltipText = `You've paid for this, hooray!`;
          if (item.determination === 'single_use') {
            attachedClasses.push(classes.Selected);
          }
          break;
        case 'inactive':
          attachedClasses.push(classes.Selected);
          tooltipText = 'You have purchased this item in another division.';
          break;
        default:
          tooltipText = '?';
          break;
      }
    } else {
      switch (item.signupStatus) {
        case 'initial':
          tooltipText = 'You may sign up for this.';
          break;
        case 'paid':
          tooltipText = `You've paid for this, so signing up cannot be undone.`;
          if (item.determination === 'single_use') {
            attachedClasses.push(classes.Selected);
          }
          break;
        case 'inactive':
          attachedClasses.push(classes.Selected);
          tooltipText = 'You have signed up for this item in another division.';
          break;
        case 'requested':
          tooltipText = `Tap or click the icon link to add this item's fee to your cart.`;
          if (item.determination === 'multi_use') {
            if (item.quantity > 0) {
              tooltipText = 'This item is in your cart.';
              attachedClasses.push(classes.NotSelected);
            }
          } else {
            if (item.addedToCart) {
              tooltipText = 'This item is in your cart.';
              attachedClasses.push(classes.Selected);
            } else {
              attachedClasses.push(classes.NotSelected);
            }
          }
          break;
        default:
          tooltipText = '?';
          break;
      }
    }
  }

  const changeProcessed = () => {
    setProcessing(false);
  }

  const changeFailed = (_) => {
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
             disabled={!!item.addedToCart || item.quantity > 0}
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

  const disabledDisplay = (
    <div className={`form-check`}>
      <input type={'checkbox'}
             aria-label={'Another item in this division was requested'}
             id={`disabledDisplay_${item.identifier}`}
             className={'form-check-input'}
             defaultChecked={false}
             readOnly={true}
             disabled={true}
      />
      <label className={`form-check-label ${classes.SignupLink}`}
             htmlFor={`disabledDisplay_${item.identifier}}`}
      >
        Sign up
      </label>
    </div>
  );

  let addLink = '';
  let addLinkEnabled = item.signupStatus === 'requested' && !item.addedToCart ||
    item.determination === 'multi_use' && ['requested', 'paid'].includes(item.signupStatus);
  if (disableUnpaidSignup) {
    // Different conditions apply.
    addLinkEnabled = item.determination === 'single_use' && // one-time only, AND
      !item.addedToCart && // not already in the cart, AND
      !['inactive', 'paid'].includes(item.signupStatus) // not already paid (or rendered inactive)
      || // OR
      item.determination === 'multi_use'; // can have many
  }
  if (addLinkEnabled) {
    addLink = (
      <a href={'#'}
         onClick={addClickedHandler}
         className={`${classes.AddLink} d-block ms-auto my-auto pe-2`}>
        <i className={`bi-cart-plus-fill`} />
        <span className={'visually-hidden'}>Add</span>
      </a>
    )
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
            item.enabled && !disableUnpaidSignup && (
                <div className={'pb-2'}>
                  {!!item.siblingSignedUp && disabledDisplay}
                  {item.signupStatus === 'initial' && !item.siblingSignedUp && signupAction}
                  {item.signupStatus === 'requested' && !item.siblingSignedUp && neverMindAction}
                  {item.signupStatus === 'paid' && paidDisplay}
                  {item.signupStatus === 'inactive' && disabledDisplay}
                </div>
              )
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
