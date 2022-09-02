import {Row} from "react-bootstrap";

import classes from './Navigation.module.scss';

const Navigation = ({showHomeLink}) => {
  return (
    <div className={`${classes.Navigation}`}>
      <Row className={process.env.NODE_ENV === 'development' && classes.Development}>
        <div className={`${classes.HomeLinks} d-flex d-md-none`}>
          <a href={'/'} title={'To the front page'} className={'link-dark'}>
            <span className={'visually-hidden'}>Home</span>
            <i className={'bi-house'} aria-hidden={true}/>
          </a>
        </div>

        {showHomeLink &&
          <a href={'/'} className={'d-none d-md-block'}>
            <div className={`${classes.HomeLinkMd} my-1`}>
              <span className={'visually-hidden'}>
                Home
              </span>
            </div>
          </a>
        }

      </Row>
    </div>
  );
};

export default Navigation;