import Image from 'react-bootstrap/Image';
import classes from './TournamentLogo.module.scss';

const TournamentLogo = ({url, additionalClasses = ''}) => {
  if (!url) {
    return '';
  }

  return (
    <Image src={url}
           alt={'Tournament logo'}
           fluid
           className={`${classes.TournamentLogo} ${additionalClasses}`}
    />
  );
}

export default TournamentLogo;
