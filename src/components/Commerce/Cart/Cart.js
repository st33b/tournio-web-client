import {useRegistrationContext} from "../../../store/RegistrationContext";
import SingleUseItem from "./SingleUseItem/SingleUseItem";
import MultiUseItem from "./MultiUseItem/MultiUseItem";

import classes from './Cart.module.scss';

const cart = ({itemAddedToCart, itemRemovedFromCart}) => {
  const {commerce, commerceDispatch} = useRegistrationContext();

  if (!commerce || !commerce.cart) {
    return '';
  }

  const sum = (runningTotal, currentValue) => runningTotal + currentValue.value * (currentValue.quantity || 1);
  const totalFees = commerce.cart.reduce(sum, 0);
  let cartItems = (
    <div className={classes.EmptyItemList}>
      <p className={'my-0 py-2 ps-2'}>
        Your cart is empty.
      </p>
    </div>
  );

  if (commerce.cart.length > 0) {
    cartItems = (
      <div className={classes.ItemList}>
        {commerce.cart.map((item, index) => {
          if (item.determination === 'multi_use') {
            return (
              <MultiUseItem key={index}
                            item={item}
                            increase={itemAddedToCart}
                            decrease={itemRemovedFromCart} />
            );
          }
          return (
            <SingleUseItem key={index}
                           item={item}
                           removed={itemRemovedFromCart} />
          );
        })}
      </div>
    );
  }

  return (
    <div className={classes.Cart}>
      <h4 className={'py-2 py-md-0'}>
        Cart
      </h4>
      {cartItems}
      <p className={classes.TotalFees}>
        Total: ${totalFees}
      </p>
    </div>
  );
}

export default cart;