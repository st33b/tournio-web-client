import Card from 'react-bootstrap/Card';

import classes from './LogoImage.module.scss';

const LogoImage = ({src}) => {
  let content = (
    <Card.Text>
      No logo image present.
    </Card.Text>
  );

  if (src) {
    content = <Card.Img src={src} className={classes.Image} />;
  }

  return content;
}

export default LogoImage;
