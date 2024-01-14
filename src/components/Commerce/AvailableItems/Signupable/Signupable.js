import {useState} from "react";
import classes from "./Signupable.module.scss";
import ErrorBoundary from "../../../common/ErrorBoundary";
import {signupableStatusUpdated} from "../../../../store/actions/registrationActions";

const Signupable = ({signupable, added, preview, signupChanged}) => {
  const [processing, setProcessing] = useState(false);

  const addClickedHandler = (event) => {
    event.preventDefault();
    added(item);
  }

  if (!signupable.purchasableItem) {
    return '';
  }
  const item = signupable.purchasableItem;

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
  if (item.addedToCart) {
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
    signupChanged(signupable.identifier, 'request', changeProcessed, changeFailed);
  }

  const neverMindClicked = (event) => {
    event.preventDefault();
    setProcessing(true);
    signupChanged(signupable.identifier, 'never_mind', changeProcessed, changeFailed);
  }

  let signupAction = (
    <div className={`form-check`}>
      <input type={'checkbox'}
             aria-label={'Sign up'}
             id={`signupAction_${signupable.identifier}`}
             className={'form-check-input'}
             onClick={signupClicked}
      />
      <label className={`form-check-label ${classes.SignupLink}`}
             htmlFor={`signupAction_${signupable.identifier}`}
      >
        Sign up
      </label>
    </div>
  );

  const neverMindAction = (
    <div className={`form-check`}>
      <input type={'checkbox'}
             aria-label={'Back out'}
             id={`neverMindAction_${signupable.identifier}`}
             className={'form-check-input'}
             checked={true}
             onClick={neverMindClicked}
      />
      <label className={`form-check-label ${classes.SignupLink}`}
             htmlFor={`neverMindAction_${signupable.identifier}}`}
      >
        Sign up
      </label>
    </div>
  );

  const paidDisplay = (
    <div className={`form-check`}>
      <input type={'checkbox'}
             aria-label={'Paid'}
             id={`paidDisplay_${signupable.identifier}`}
             className={'form-check-input'}
             checked={true}
             disabled={true}
      />
      <label className={`form-check-label ${classes.SignupLink}`}
             htmlFor={`paidDisplay_${signupable.identifier}}`}
      >
        Sign up
      </label>
    </div>
  );

  let addLink = '';
  if (signupable.status === 'requested') {
    addLink = (
      <a href={'#'}
         onClick={addClickedHandler}
         className={`${classes.AddLink} d-block align-self-stretch pe-2`}>
        <i className={`bi-cart-plus-fill`} />
        <span className={'visually-hidden'}>Add</span>
      </a>
    )
  }

  let actionBlock = (
    <div className={'spinner-border text-secondary ms-auto align-self-start me-3'} role={'status'}>
      <span className={'visually-hidden'}>Processing...</span>
    </div>
  );

  if (!processing) {
    const alignClass = signupable.status === 'requested' ? 'justify-content-start' : 'justify-content-between';
    actionBlock = (
      <div className={`ms-auto text-end pt-2 pe-2 d-flex flex-column ${alignClass}`}>
        {signupable.status === 'initial' && signupAction}
        {signupable.status === 'requested' && neverMindAction}
        {signupable.status === 'paid' && paidDisplay}
        {addLink}
      </div>
    );
  }

  if (signupable.status === 'paid') {
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
        </div>
        {actionBlock}
      </div>
    </ErrorBoundary>
  );
}

export default Signupable;
