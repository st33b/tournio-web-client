import Card from 'react-bootstrap/Card';

import classes from './TournamentDetails.module.scss';

const tournamentLogo = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card border={'0'} className={'d-none d-lg-block text-center'}>
      <Card.Body>
        <Card.Img variant={'top'} src={tournament.image_path} className={classes.Logo}/>
      </Card.Body>
    </Card>
  );
}

export default tournamentLogo;