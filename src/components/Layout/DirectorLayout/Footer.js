import Row from "react-bootstrap/Row";
import classes from './Footer.module.scss';

const footer = () => (
  <div className={classes.Footer}>
    <Row className={process.env.NODE_ENV === 'development' && classes.Development}>
      <p className={'text-muted text-center py-2 my-2'}>
        Problems? Feedback? Drop an email to&nbsp;
        <a href={'mailto:info@igbo-reg.com?subject=Feedback'}>
          info@igbo-reg.com
        </a>
      </p>
    </Row>
  </div>
);

export default footer;