import {apparelSizeMapping} from '../../../../utils';
import classes from "./Item.module.scss";
import {useState} from "react";
import ErrorBoundary from "../../../common/ErrorBoundary";

const Item = ({item, added, preview}) => {
  const initialSizeForm = {
    identifier: '',
  }

  const [sizeForm, setSizeForm] = useState(initialSizeForm);

  const addClickedHandler = (event) => {
    event.preventDefault();
    added(item, sizeForm.identifier);
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


  const sizeChosen = (event) => {
    const newValue = event.target.value;
    const form = {...sizeForm};
    form.identifier = newValue;
    setSizeForm(form);
  }

  let sizeText = '';
  if (item.configuration) {
    if (item.configuration.sizes && item.configuration.sizes.length > 0) {
      // Yay, we have some sizes!
      sizeText = (
        <select className={'form-select'}
                name={'identifier'}
                value={sizeForm.identifier}
                onChange={sizeChosen}>
          <option value={''}>-- Size:</option>
          {item.configuration.sizes.map(({identifier, displaySize}) => {
            return (
              <option key={identifier}
                      value={identifier}>
                {displaySize}
              </option>
            )
          })}
        </select>
      );
    } else if (item.configuration.size) {
      sizeText = (
        <p>
          {apparelSizeMapping[item.configuration.size]}
        </p>
      );
    }
  }

  const sizeRequired = item.determination && 'apparel' && item.refinement === 'sized';
  const sizeValid = !sizeRequired || sizeRequired && sizeForm.identifier.length > 0;

  let attachedClasses = [classes.Item, 'mb-3', 'mx-0', 'd-flex'];
  if (item.determination === 'event') {
    attachedClasses.push('border-primary', 'border-3');
  }
  let tooltipText = 'Click the + to select this item';
  if (item.addedToCart) {
    attachedClasses.push(classes.Selected);
    tooltipText = 'This item has been chosen';
  } else {
    attachedClasses.push(classes.NotSelected);
  }

  let addLink = '';
  if (!sizeValid) {
    tooltipText = 'Select a size to add';
  }
  if (!preview && !item.addedToCart) {
    addLink = (
      <div className={'ms-auto align-self-center'}>
        <a href={sizeValid ? '#' : null}
           onClick={sizeValid ? addClickedHandler : () => {}}
           className={`${classes.AddLink} ${!sizeValid ? classes.AddDisabled : ''} pe-3`}>
          <i className={`bi-plus-square-fill`} />
          <span className={'visually-hidden'}>Add</span>
        </a>
      </div>
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
          {sizeText}
          <p className={classes.Price}>
            ${item.value}
          </p>
        </div>
        {addLink}
      </div>
    </ErrorBoundary>
  );
}

export default Item;
