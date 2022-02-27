import {useRegistrationContext} from "../../store/RegistrationContext";

import classes from './Menu.module.scss';
import PreviousPurchases from "./PreviousPurchases/PreviousPurchases";
import AvailableItems from "./AvailableItems/AvailableItems";
import Cart from "./Cart/Cart";
import {Col, Row} from "react-bootstrap";

const menu = () => {
  const {commerce, commerceDispatch} = useRegistrationContext();

  let successMessage = '';

  return (
    <div className={classes.Menu}>
      <Row>
        <Col className={'collapse d-md-none'}
             id={'mobile_cart'}>
          <Cart/>
        </Col>
        <Col md={4}>
          <PreviousPurchases/>
        </Col>
        <Col md={4}>
          <AvailableItems itemAddedToCart={() => {}}/>
        </Col>
        <Col md={4}
             className={'d-none d-md-block'}
             id={'cart'}>
          <Cart/>
        </Col>
      </Row>
    </div>
  );
}

export default menu;