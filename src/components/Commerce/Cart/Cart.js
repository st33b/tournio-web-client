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
      <div className={`${classes.ItemList}`}>
        {commerce.cart.map((item, index) => {
          if (['product', 'raffle', 'banquet', 'bracket'].includes(item.category) || item.determination === 'multi_use') {
            return (
              <MultiUseItem key={index}
                            item={item}
                            increase={itemAddedToCart}
                            decrease={itemRemovedFromCart}/>
            );
          }
          return (
            <SingleUseItem key={index}
                           item={item}
                           removed={itemRemovedFromCart}/>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`offcanvas-md offcanvas-end ${classes.Cart}`}
         aria-labelledby={`cartTitle`}
         tabIndex={-1}
         id={`mobile_cart`}
    >
      <h5 className={`d-none d-md-block`}>
        Cart
      </h5>
      <div className={`offcanvas-header ${classes.SmallCartHeader}`}>
        <h4 className={`offcanvas-title flex-grow-1`}
            id={`cartTitle`}>
          Cart
        </h4>
        <button type={"button"}
                className={`btn-close`}
                data-bs-dismiss={`offcanvas`}
                data-bs-target={`#mobile_cart`}
                aria-label="Close"></button>
      </div>
      <div className={`offcanvas-body flex-wrap`}>
          {cartItems}
          <p className={`${classes.TotalFees} w-100`}>
            Total: ${totalFees}
          </p>
          <div className={'w-100'}>
            <StripeCheckout />
          </div>
      </div>
    </div>
  );
}

export default Cart;
