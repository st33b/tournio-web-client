import {Row} from "react-bootstrap";
import Image from "next/image";

import {useCommerceContext} from "../../../store/CommerceContext";
import {useThemeContext} from "../../../store/ThemeContext";
import {useClientReady} from "../../../utils";

import TournioLogoLight from '../../../images/tournio-logo.png';
import TournioLogoDark from '../../../images/tournio-logo-inverted-gray.png';
import ColorModeToggler from "../../common/ColorModeToggler/ColorModeToggler";

import classes from './Navigation.module.scss';

const Navigation = ({showCart}) => {
  const {commerce} = useCommerceContext();
  const {theme} = useThemeContext();

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  let cartText = '';
  if (showCart && commerce && commerce.cart) {
    cartText = (
      <a href={'#mobile_cart'}
         title={'Cart'}
         data-bs-toggle={'offcanvas'}
         data-bs-target={'#offcanvasCart'}
         aria-controls={'offcanvasCart'}
         // aria-expanded={false}
         className={`${classes.Bag} ms-auto d-md-none`}>
        <span className={'visually-hidden'}>Cart</span>
        <i className={'bi-cart position-relative'} aria-hidden={true}>
          {/*Cart*/}
          <span className={`${classes.Badge} position-absolute top-0 start-50 badge rounded-pill bg-danger`}>
            {commerce.cart.length}
          </span>
        </i>
      </a>
    );
  }

  const activeTheme = theme.active;

  return (
    <div className={`${classes.Navigation}`}>
      <Row className={process.env.NODE_ENV === 'development' && classes.Development}>
        <div className={`${classes.NavLinks} d-flex`}>
          <a href={'/tournaments'}
             title={'To tournament listing'}
             className={'d-md-none'}>
            <span className={'visually-hidden'}>Home</span>
            <i className={'bi-house'} aria-hidden={true} />
          </a>
          {cartText}
          <a href={'/tournaments'}
             title={'To tournament listing'}
             className={`d-none d-md-inline-block ${classes.LogoLink}`}>
            <Image src={activeTheme === 'light' ? TournioLogoLight : TournioLogoDark}
                   alt={'Tournio Logo'}
                   className={`${classes.Image} img-fluid`}
                   />
            <span className={'visually-hidden'}>
              Home
            </span>
          </a>
          <ColorModeToggler className={'ms-auto d-none d-md-inline-block'} />
        </div>
      </Row>
    </div>
  );
};

export default Navigation;
