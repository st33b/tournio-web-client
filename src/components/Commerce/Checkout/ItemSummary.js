import {useRegistrationContext} from "../../../store/RegistrationContext";
import Item from "./Item";

import classes from './ItemSummary.module.scss';

const itemSummary = ({totalFees}) => {
  const {commerce} = useRegistrationContext();

  if (!commerce || !commerce.cart) {
    return;
  }

  return (
    <div className={classes.ItemSummary}>
      <h4>
        Items/Events
      </h4>
      <div className={classes.ItemList}>
        {commerce.cart.map((item, index) => {
          return (
            <Item
              key={index}
              item={item}
            />
          );
        })}
      </div>
      <p className={classes.TotalFees}>
        Total: ${totalFees}
      </p>
    </div>
  );
}

export default itemSummary;