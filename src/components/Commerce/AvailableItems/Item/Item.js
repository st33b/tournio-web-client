import {apparelSizeMapping} from '../../../../utils';
import classes from "./Item.module.scss";
import {useState} from "react";

const Item = ({item, added, preview}) => {
  const initialSizeForm = {
    size: '',
  }

  const [sizeForm, setSizeForm] = useState(initialSizeForm);

  const addClickedHandler = (event) => {
    event.preventDefault();
    added(item);
  }

  let secondaryText = '';
  let note = '';
  if (item.configuration.note) {
    note = `(${item.configuration.note})`;
    secondaryText = (
      <p className={classes.Note}>
        {note}
      </p>
    );
  }
  if (item.configuration.division) {
    secondaryText = (
      <p className={classes.Note}>
        Division: {item.configuration.division} {note}
      </p>
    );
  } else if (item.configuration.input_label) {
    secondaryText = (
      <form>
        <label>
          {item.configuration.input_label}
        </label>
        <input type={'text'} />
      </form>
    );
  } else if (item.configuration.denomination) {
    secondaryText = (
      <p className={classes.Note}>
        {item.configuration.denomination} {note}
      </p>
    );
  }

  const sizeChosen = (event) => {
    const newValue = event.target.value;
    const form = {...sizeForm};
    form.size = newValue;
    setSizeForm(form);
  }

  let sizeText = '';
  if (item.configuration.sizes) {
    const sizeKeys = [];
    const sizeNames = [];
    item.configuration.sizes.forEach(({size, identifier}) => {
      const [groupKey, sizeKey] = size.split('.');
      sizeKeys.push(`${groupKey}.${sizeKey}`);
      sizeNames.push(`${apparelSizeMapping[groupKey]} ${apparelSizeMapping[sizeKey]}`);

    });
    // Yay, we have some sizes!
    if (sizeKeys.length > 0) {
      sizeText = (
        <select className={'form-select'} name={'size'} onChange={sizeChosen}>
          <option value={''}>-- Size:</option>
          {sizeKeys.map((key, i) => (
            <option key={key}
                    value={key}
                    selected={sizeForm.size === key}>
              {sizeNames[i]}
            </option>
          ))}
        </select>
      );
    }
  } else if (item.configuration.size) {
    sizeText = (
      <p>
        {apparelSizeMapping[item.configuration.size]}
      </p>
    );
  }

  const sizeRequired = item.category === 'product' && item.determination && 'apparel';
  const sizeValid = !sizeRequired || sizeRequired && sizeForm.size.length > 0;

  let attachedClasses = [classes.Item, 'rounded', 'border', 'mb-3', 'mx-0', 'd-flex'];
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
    <div className={attachedClasses.join(' ')} title={tooltipText}>
      <div className={'ps-2'}>
        <p className={classes.Name}>
          {item.name}
        </p>
        {secondaryText}
        {sizeText}
        <p>
          ${item.value}
        </p>
      </div>
      {addLink}
    </div>
  );
}

export default Item;
