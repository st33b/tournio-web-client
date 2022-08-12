import classes from './TournamentLogo.module.scss';

const TournamentLogo = ({url}) => {
  if (!url) {
    return '';
  }

  return (
    <div className={classes.TournamentLogo}>
      <img src={url}
           alt={'Tournament logo'}
           className={'img-fluid'}
      />
    </div>
  );
}

export default TournamentLogo;