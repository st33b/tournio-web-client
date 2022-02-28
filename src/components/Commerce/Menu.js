import {Col, Row} from "react-bootstrap";
import {useRegistrationContext} from "../../store/RegistrationContext";
import {itemAddedToCart, itemRemovedFromCart} from "../../store/actions/registrationActions";

import classes from './Menu.module.scss';
import PreviousPurchases from "./PreviousPurchases/PreviousPurchases";
import AvailableItems from "./AvailableItems/AvailableItems";
import Cart from "./Cart/Cart";

const menu = () => {
  const {commerceDispatch} = useRegistrationContext();

  let successMessage = '';

  const itemAdded = (item) => {
    commerceDispatch(itemAddedToCart(item));
  }

  const itemRemoved = (item) => {
    commerceDispatch(itemRemovedFromCart(item));
  }

  return (
    <div className={classes.Menu}>
      <Row>
        <Col className={'collapse d-md-none order-1'}
             id={'mobile_cart'}>
          <Cart itemAddedToCart={itemAdded}
                itemRemovedFromCart={itemRemoved} />
        </Col>
        <Col md={4} className={'order-4 order-md-2'}>
          <PreviousPurchases/>
        </Col>
        <Col md={4} className={'order-2 order-md-3'}>
          <AvailableItems itemAddedToCart={itemAdded}/>
        </Col>
        <Col md={4}
             className={'d-none d-md-block order-3 order-md-4'}
             id={'cart'}>
          <Cart itemAddedToCart={itemAdded}
                itemRemovedFromCart={itemRemoved} />
        </Col>
      </Row>
    </div>
  );
}

export default menu;