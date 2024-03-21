import {useCommerceContext} from "../../../../store/CommerceContext";

import classes from './SingleUseItem.module.scss';
import ErrorBoundary from "../../../common/ErrorBoundary";

const SingleUseItem = ({item, removed}) => {
  const {commerce} = useCommerceContext();

  const removeClickedHandler = (event) => {
    event.preventDefault();
    removed(item);
  }

  if (!commerce || !item) {
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

  let {name, note, value} = item;

  if (item.refinement === 'division') {
    note = `Division: ${item.configuration.division}`;
  }

  const outerClasses = [
    classes.SingleUseItem,
    'rounded',
    'border',
    'mb-3',
    'mx-0',
    'd-flex',
  ];

  let sign = '';
  if (item.category === 'ledger') {
    outerClasses.push(classes.Sticky);
    if (item.refinement === 'event_linked') {
      note = `Event: ${commerce.availableItems[item.configuration.event].name}`;
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
      note = `Events: ${matchingEvents.map(event => event.name).join(', ')}`;
    }
    if (item.determination.includes('discount')) {
      sign = '–';
    }
  }

  return (
    <ErrorBoundary>
      <div className={outerClasses.join(' ')}>
        <div className={'ps-2'}>
          <p>
            {name}
          </p>
          {note && (
            <p className={classes.Note}>
              {note}
            </p>
          )}
          <p>
            {sign}${value}
          </p>
        </div>
        {removeLink}
      </div>
    </ErrorBoundary>
  );
}

export default SingleUseItem;
