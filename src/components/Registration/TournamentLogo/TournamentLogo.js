import Image from 'react-bootstrap/Image';
import classes from './TournamentLogo.module.scss';

const TournamentLogo = ({url}) => {
  if (!url) {
    return '';
  }

  return (
    <Image src={url}
           alt={'Tournament logo'}
           fluid
           className={classes.TournamentLogo}
    />
  );
}

export default TournamentLogo;