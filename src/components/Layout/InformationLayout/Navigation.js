import {Row} from "react-bootstrap";
import Image from "next/image";

import {useThemeContext} from "../../../store/ThemeContext";

import TournioLogoLight from '../../../images/tournio-logo.png';
import TournioLogoDark from '../../../images/tournio-logo-inverted-gray.png';
import ColorModeToggler from "../../common/ColorModeToggler/ColorModeToggler";

import classes from './Navigation.module.scss';
import {useClientReady} from "../../../utils";

const Navigation = () => {
  const {theme} = useThemeContext();
  const ready = useClientReady();
  if (!ready) {
    return null;
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
