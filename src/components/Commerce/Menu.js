import {Col, Row} from "react-bootstrap";
import {useRegistrationContext} from "../../store/RegistrationContext";
import {itemAddedToCart, itemRemovedFromCart} from "../../store/actions/registrationActions";

import classes from './Menu.module.scss';
import PreviousPurchases from "./PreviousPurchases/PreviousPurchases";
import AvailableItems from "./AvailableItems/AvailableItems";
import Cart from "./Cart/Cart";

const menu = () => {
  const {commerce, commerceDispatch} = useRegistrationContext();

  let successMessage = '';

  const itemAdded = (item) => {
    console.log('Item added to cart. Dispatching to reducer');
    console.log(item);
    commerceDispatch(itemAddedToCart(item));
  }

  const itemRemoved = (item) => {
    console.log('Item removed from cart. Dispatching to reducer');
    console.log(item);
    commerceDispatch(itemRemovedFromCart(item));
  }



  return (
    <div className={classes.Menu}>
      <Row>
        <Col className={'collapse d-md-none'}
             id={'mobile_cart'}>
          <Cart itemAddedToCart={itemAdded}
                itemRemovedFromCart={itemRemoved} />
        </Col>
        <Col md={4}>
          <PreviousPurchases/>
        </Col>
        <Col md={4}>
          <AvailableItems itemAddedToCart={itemAdded}/>
        </Col>
        <Col md={4}
             className={'d-none d-md-block'}
             id={'cart'}>
          <Cart itemAddedToCart={itemAdded}
                itemRemovedFromCart={itemRemoved} />
        </Col>
      </Row>
    </div>
  );
}

export default menu;