import Row from "react-bootstrap/Row";
import classes from './Footer.module.scss';

const Footer = () => (
  <div className={classes.Footer}>
    <Row className={process.env.NODE_ENV === 'development' && classes.Development}>
      <p className={'text-muted text-center py-2 my-2'}>
        Problems? Feedback? Drop an email to&nbsp;
        <a href={'mailto:feedback@tourn.io'}>
          feedback@tourn.io
        </a>
      </p>
    </Row>
  </div>
);

export default Footer;