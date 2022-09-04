import {useCommerceContext} from "../../../../store/CommerceContext";

import classes from './SingleUseItem.module.scss';

const SingleUseItem = ({item, removed}) => {
  const {commerce} = useCommerceContext();

  const removeClickedHandler = (event) => {
    event.preventDefault();
    removed(item);
  }

  if (!commerce) {
    return '';
  }

  let removeLink = '';
  if (item.category !== 'ledger') {
    removeLink = (
      <div className={'ms-auto align-self-center'}>
        <a href={'#'}
           onClick={removeClickedHandler}
           className={`${classes.RemoveLink} pe-3 text-danger text-opacity-75`}>
          <i className={'bi-x-circle-fill'} />
          <span className={'visually-hidden'}>Remove</span>
        </a>
      </div>
    );
  }

  let note = '';
  if (item.configuration.division) {
    note = (
      <p className={classes.Note}>
        Division: {item.configuration.division}
      </p>
    );
  }

  const outerClasses = [
    classes.SingleUseItem,
    'rounded',
    'border',
    'border-secondary',
    'mb-3',
    'mx-0',
    'd-flex',
  ];

  if (item.category === 'ledger') {
    outerClasses.push(classes.Sticky);
    if (item.configuration.event) {
      note = (
        <p className={classes.Note}>
          Event: {commerce.availableItems[item.configuration.event].name}
        </p>
      );
    }
    if (item.configuration.events) {
      // We need to check purchased items as well as available items for the label to apply.
      const allItems = commerce.purchasedItems.concat(Object.values(commerce.availableItems));
      const matchingEvents = [];
      allItems.forEach(i => {
        let identifier = i.identifier;
        if (i.purchasable_item_identifier) {
          identifier = i.purchasable_item_identifier;
        }
        if (item.configuration.events.includes(identifier)) {
          matchingEvents.push(i);
        }
      });
      note = (
        <p className={classes.Note}>
          Events: {matchingEvents.map(event => event.name).join(', ')}
        </p>
      );
    }
  }

  return (
    <div className={outerClasses.join(' ')}>
      <div className={'ps-2'}>
        <p>
          {item.name}
        </p>
        {note}
        <p>
          ${item.value}
        </p>
      </div>
      {removeLink}
    </div>
  );
}

export default SingleUseItem;