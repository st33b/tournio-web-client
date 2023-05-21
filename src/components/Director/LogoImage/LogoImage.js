import Card from 'react-bootstrap/Card';

import classes from './LogoImage.module.scss';

const LogoImage = ({src}) => {
  let content = (
    <Card.Text>
      No logo image present.
    </Card.Text>
  );

  if (src) {
    content = (
      <div className={classes.LogoImage}>
        <Card.Img src={src} />
      </div>
    );
  }

  return content;
}

export default LogoImage;
