import {Col, Row} from "react-bootstrap";
import {useCommerceContext} from "../../store/CommerceContext";
import {itemAddedToCart, itemRemovedFromCart} from "../../store/actions/registrationActions";

import PreviousPurchases from "./PreviousPurchases/PreviousPurchases";
import AvailableItems from "./AvailableItems/AvailableItems";
import Cart from "./Cart/Cart";

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
        <Col md={8}>
          <AvailableItems itemAddedToCart={itemAdded}/>
        </Col>
        <Col md={4}
             className={`${classes.CartContainer}`}
             id={'cart'}>
          <Cart itemAddedToCart={itemAdded}
                itemRemovedFromCart={itemRemoved} />
        </Col>
      </Row>
    </div>
  );
}

export default Menu;
