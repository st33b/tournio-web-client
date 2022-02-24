import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './TournamentLogo.module.scss';

const tournamentLogo = () => {
  const {entry} = useRegistrationContext();

  if (!entry.tournament) {
    return '';
  }

  return (
    <div className={classes.TournamentLogo}>
      <img className="img-fluid" alt="Tournament logo" src={entry.tournament.image_path} />
    </div>
  );
}

export default tournamentLogo;