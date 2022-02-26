import classes from './Navigation.module.scss';
import {Row} from "react-bootstrap";

const navigation = (props) => {
  return (
    <div className={classes.Navigation}>
      <Row>
        <h1 className={`${classes.HomeLink} d-md-none`}>
          <a href={'/'} title={'To tournament listing'} className={'link-dark'}>
            <i className={'bi-menu-button-wide'} aria-hidden={true} />
          </a>
        </h1>
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