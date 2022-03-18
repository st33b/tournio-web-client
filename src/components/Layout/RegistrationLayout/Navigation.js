import {Row} from "react-bootstrap";
import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './Navigation.module.scss';

const navigation = ({showCart}) => {
  const {commerce} = useRegistrationContext();

  let cartText = '';
  if (showCart && commerce && commerce.cart) {
    cartText = (
      <a href={'#mobile_cart'}
         title={'Cart'}
         data-bs-toggle={'collapse'}
         aria-controls={'mobile_cart'}
         aria-expanded={false}
         className={`${classes.Bag} ms-auto`}>
        <span className={'visually-hidden'}>Cart</span>
        <i className={'bi-cart text-success position-relative'} aria-hidden={true}>
          {/*Cart*/}
          <span className={`${classes.Badge} position-absolute top-0 start-50 badge rounded-pill bg-danger`}>
            {commerce.cart.length}
          </span>
        </i>
      </a>
    );
  }
  return (
    <div className={`${classes.Navigation}`}>
      <Row className={process.env.NODE_ENV === 'development' && classes.Development}>
        <div className={`${classes.HomeLinks} d-flex d-md-none`}>
          <a href={'/'} title={'To tournament listing'} className={'link-dark'}>
            <span className={'visually-hidden'}>Home</span>
            <i className={'bi-house'} aria-hidden={true} />
          </a>
          {cartText}
        </div>
        <h1 className={`${classes.HomeLinkMd} d-none d-md-block my-1`}>
          <a href={'/'}>
            IGBO Tournament Registration
          </a>
        </h1>
      </Row>
    </div>
  );
};

export default navigation;