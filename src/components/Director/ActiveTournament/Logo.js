import Card from 'react-bootstrap/Card';

import classes from './ActiveTournament.module.scss';
import {Placeholder} from "react-bootstrap";

const Logo = ({src}) => {
  let content = (
    <Placeholder as={Card.Text} animation="glow">
      <Placeholder xs={7}/>{' '}
      <Placeholder xs={4}/>{' '}
      <Placeholder xs={4}/>{' '}
      <Placeholder xs={6}/> {' '}
      <Placeholder xs={8}/>
    </Placeholder>
  );
  if (src) {
    content = <Card.Img variant={'top'} src={src} className={classes.Logo}/>;
  }

  return (
    <Card border={'0'} className={'d-none d-md-block text-center'}>
      <Card.Body>
        {content}
      </Card.Body>
    </Card>
  );
}

export default Logo;