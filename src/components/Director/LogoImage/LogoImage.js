import Card from 'react-bootstrap/Card';

import classes from './LogoImage.module.scss';

const LogoImage = ({src}) => {
  let content = (
    <Card.Text className={'py-4 border border-1'}>
      No logo image present.
    </Card.Text>
  );

  if (src) {
    content = <Card.Img variant={'top'} src={src} className={classes.Image}/>;
  }

  return (
    <Card border={'0'} className={`d-none d-md-block text-center mb-3 ${classes.LogoImage}`}>
      {content}
    </Card>
  );
}

export default LogoImage;