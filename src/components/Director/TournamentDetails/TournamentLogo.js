import Card from 'react-bootstrap/Card';

import classes from './TournamentDetails.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";

const TournamentLogo = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  return (
    <Card border={'0'} className={'d-none d-lg-block text-center'}>
      <Card.Body>
        <Card.Img variant={'top'} src={context.tournament.image_path} className={classes.Logo}/>
      </Card.Body>
    </Card>
  );
}

export default TournamentLogo;