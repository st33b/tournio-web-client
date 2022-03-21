import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './PreviousPurchases.module.scss';

const PreviousPurchases = () => {
  const {commerce} = useRegistrationContext();

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
    purchaseList = (
      <ul>
        {commerce.purchasedItems.map((item, index) => {
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
        Paid Events/Items
      </h4>
      {purchaseList}
    </div>
  )
}

export default PreviousPurchases;