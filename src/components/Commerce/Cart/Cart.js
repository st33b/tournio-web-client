import {useCommerceContext} from "../../../store/CommerceContext";
import SingleUseItem from "./SingleUseItem/SingleUseItem";
import MultiUseItem from "./MultiUseItem/MultiUseItem";

import classes from './Cart.module.scss';
import StripeCheckout from "../StripeCheckout/StripeCheckout";

const Cart = ({itemAddedToCart, itemRemovedFromCart}) => {
  const {commerce} = useCommerceContext();

  if (!commerce || !commerce.cart) {
    return '';
  }

  const sum = (runningTotal, currentValue) => {
    if (currentValue.category === 'ledger' && (currentValue.determination === 'early_discount'
      || currentValue.determination === 'bundle_discount')) {
      return runningTotal - currentValue.value * (currentValue.quantity || 1);
    }
    return runningTotal + currentValue.value * (currentValue.quantity || 1);
  };
  const totalFees = commerce.cart.reduce(sum, 0);
  let cartItems = (
    <div className={classes.EmptyItemList}>
      <p className={'py-2 ps-2 mb-2'}>
        Your cart is empty.
      </p>
    </div>
  );

  if (commerce.cart.length > 0) {
    cartItems = (
      <div className={classes.ItemList}>
        {commerce.cart.map((item, index) => {
          if (['product', 'raffle', 'banquet', 'bracket'].includes(item.category) || item.determination === 'multi_use') {
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

  const enableFailure = commerce.tournament.state === 'testing';

  return (
    <div className={classes.Cart}>
      <h5 className={``}>
        Cart
      </h5>
      {cartItems}
      <p className={classes.TotalFees}>
        Total: ${totalFees}
      </p>
      <div className={'d-flex flex-row-reverse pb-3 pb-md-0'}>
        {/*<StripeCheckout />*/}
        <StripeCheckout enableFailure={enableFailure}/>
      </div>
    </div>
  );
}

export default Cart;
