import {useCommerceContext} from "../../../store/CommerceContext";

import classes from './PreviousPurchases.module.scss';

const PreviousPurchases = () => {
  const {commerce} = useCommerceContext();

  if (!commerce) {
    return '';
  }

  let purchaseList = (
    <div className={classes.EmptyItemList}>
      <p className={''}>
        No paid purchases yet.
      </p>
    </div>
  );
  if (commerce.purchasedItems && commerce.purchasedItems.length > 0) {
    const countsByItemID = {};
    commerce.purchasedItems.forEach(p => {
      const piId = p.purchasableItem.identifier;
      if (!countsByItemID[piId]) {
        countsByItemID[piId] = 0;
      }
      countsByItemID[piId] += 1;
    });

    purchaseList = commerce.purchasedItems.map((purchase, index) => {
      const purchasableItem = purchase.purchasableItem;
      const quantity = countsByItemID[purchasableItem.identifier];
      if (quantity === 0) {
        return '';
      }
      const multiplier = quantity === 1 ? '' : (
        <span>
          <i className={'bi bi-x-lg px-2'} aria-hidden={true} />
          {quantity}
          <span className={'visually-hidden'}>
              purchased
            </span>
          </span>
      );
      countsByItemID[purchasableItem.identifier] = 0;
      {
        multiplier
      }

      let note = '';
      if (purchasableItem.configuration.division) {
        note = (
          <p className={classes.Note}>
            Division: {purchasableItem.configuration.division}
          </p>
        );
      }
      return (
        <div className={`d-flex ${classes.Item}`} key={index}>
          <i className={`bi bi-check2-square ${classes.ListMarker}`} aria-hidden={true}></i>
          <div className={``}>
            <p className={classes.MainText}>
              {purchasableItem.name}
              {multiplier}
            </p>
            {note}
          </div>
        </div>

      );
    });
  }

  return (
    <div className={classes.PreviousPurchases}>
      <h5>
        Paid Items
      </h5>
      {purchaseList}
    </div>
  )
}

export default PreviousPurchases;
