import Image from "next/image";
import classes from './TournamentLogo.module.scss';

const tournamentLogo = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <div className={classes.TournamentLogo}>
      <img src={tournament.image_path}
           alt={'Tournament logo'}
           className={'img-fluid'}
      />
    </div>
  );
}

export default tournamentLogo;