import {useCommerceContext} from "../../../store/CommerceContext";

import classes from './PreviousPurchases.module.scss';

const PreviousPurchases = () => {
  const {commerce} = useCommerceContext();

  if (!commerce) {
    return '';
  }

  let purchaseList = (
    <div className={classes.EmptyItemList}>
      <p className={'my-0 py-2 ps-2'}>
        No paid purchases yet.
      </p>
    </div>
  );
  if (commerce.purchasedItems && commerce.purchasedItems.length > 0) {
    const countsByItemID = {};
    commerce.purchasedItems.forEach(p => {
      const piId = p.purchasable_item_identifier;
      if (!countsByItemID[piId]) {
        countsByItemID[piId] = 0;
      }
      countsByItemID[piId] += 1;
    });

    purchaseList = (
      <ul>
        {commerce.purchasedItems.map((item, index) => {
          const quantity = countsByItemID[item.purchasable_item_identifier];
          if (quantity === 0) {
            return '';
          }
          const multiplier = quantity === 1 ? '' : (
            <span>
                <i className={'bi-x px-1'}aria-hidden={true} />
              {quantity}
              <span className={'visually-hidden'}>
                  purchased
                </span>
              </span>
          );
          countsByItemID[item.purchasable_item_identifier] = 0;
                {multiplier}

          let note = '';
          if (item.configuration.division) {
            note = (
              <p className={classes.Note}>
                Division: {item.configuration.division}
              </p>
            );
          }
          return (
            <li key={index}>
              <p className={classes.MainText}>
                {item.name}
                {multiplier}
              </p>
              {note}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className={classes.PreviousPurchases}>
      <h4 className={'py-2 py-md-0'}>
        Paid Items
      </h4>
      {purchaseList}
    </div>
  )
}

export default PreviousPurchases;
