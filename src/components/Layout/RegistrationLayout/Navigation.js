import classes from './Navigation.module.scss';
import {Row} from "react-bootstrap";

const navigation = (props) => {
  return (
    <div className={classes.Navigation}>
      <Row>
        <h1 className={'my-1'}>
          <a href={'/'}>
            IGBO Tournament Registration
          </a>
        </h1>
      </Row>
    </div>
  );
};

export default navigation;