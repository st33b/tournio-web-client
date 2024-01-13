import {useState} from "react";
import classes from "./Signupable.module.scss";
import ErrorBoundary from "../../../common/ErrorBoundary";

const Signupable = ({signupable, added, preview}) => {
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

  let signupAction = (
    <div className={`text-center`}>
      <input type={'checkbox'}
             aria-label={'Sign up'}
             id={`signupAction_${signupable.identifier}`}
             className={'form-check-input'}
             onClick={() => {}}
             />
      <a href={'#'}
         className={`d-block ${classes.SignupLink}`}
         >Sign up</a>
      {/*<label htmlFor={`signupAction_${signupable.identifier}`}*/}
      {/*       className={'form-check-label'}*/}
      {/*       >Sign up</label>*/}
    </div>
  );

  let addLink = '';
  if (!preview && !item.addedToCart) {
    addLink = (
      <a href={'#'}
         onClick={addClickedHandler}
         className={`${classes.AddLink} d-block`}>
        <i className={`bi-bag-plus-fill`} />
        <span className={'visually-hidden'}>Add</span>
      </a>
    )
  }

  const actionBlock = (
    <div className={'ms-auto pe-3'}>
      {item.status !== 'paid' && signupAction}
      {item.status === 'requested' && addLink}
    </div>
  )

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
