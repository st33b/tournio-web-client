import classes from './TournamentLogo.module.scss';

const tournamentLogo = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <div className={classes.TournamentLogo}>
      <img className="img-fluid" alt="Tournament logo" src={tournament.image_path} />
    </div>
  );
}

export default tournamentLogo;