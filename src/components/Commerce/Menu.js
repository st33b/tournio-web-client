import {Col, Row} from "react-bootstrap";
import {useCommerceContext} from "../../store/CommerceContext";
import {itemAddedToCart, itemRemovedFromCart} from "../../store/actions/registrationActions";

import PreviousPurchases from "./PreviousPurchases/PreviousPurchases";
import AvailableItems from "./AvailableItems/AvailableItems";
import Cart from "./Cart/Cart";
import FreeEntryForm from "./FreeEntryForm/FreeEntryForm";

import classes from './Menu.module.scss';

const Menu = () => {
  const {commerce, dispatch} = useCommerceContext();

  if (!commerce || !commerce.bowler) {
    return '';
  }

  const itemAdded = (item, sizeIdentifier = null) => {
    dispatch(itemAddedToCart(item, sizeIdentifier));
  }

  const itemRemoved = (item) => {
    dispatch(itemRemovedFromCart(item));
  }

  return (
    <div className={classes.Menu}>
      <Row>
        <Col className={'collapse d-md-none order-1'}
             id={'mobile_cart'}>
          <Cart itemAddedToCart={itemAdded}
                itemRemovedFromCart={itemRemoved} />
        </Col>
        <Col md={8} className={'order-4 order-md-3'}>
          <AvailableItems itemAddedToCart={itemAdded}/>
        </Col>
        <Col md={4}
             className={`d-none d-md-block order-3 order-md-4 ${classes.CartContainer}`}
             id={'cart'}>
          <Cart itemAddedToCart={itemAdded}
                itemRemovedFromCart={itemRemoved} />
        </Col>
      </Row>
    </div>
  );
}

export default Menu;
