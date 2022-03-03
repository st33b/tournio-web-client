import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

import classes from './TournamentDetails.module.scss';
import Basics from "./Basics";
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import TournamentLogo from "./TournamentLogo";
import StatusAndCounts from "./StatusAndCounts";
import PurchasableItems from "./PurchasableItems";
import Contacts from "./Contacts";
import StateChangeButton from "./StateChangeButton";
import {useDirectorContext} from "../../../store/DirectorContext";

const tournamentDetails = ({stateChangeInitiated}) => {
  const directorContext = useDirectorContext();
  const tournament = directorContext.tournament;

  if (!tournament) {
    return <div className={classes.TournamentDetails}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  const ladder = [{ text: 'Tournaments', path: '/director' }];
  return (
    <div className={classes.TournamentDetails}>
      <Breadcrumbs ladder={ladder} activeText={tournament.name} className={classes.Breadcrumbs} />

      <div className={'row'}>
        <div className={'col-12 col-md-6 col-lg-4'}>
          <Basics tournament={tournament} />
          <Configuration tournament={tournament} />
          <AdditionalQuestions tournament={tournament} />
        </div>

        <div className={'col-12 col-md-6 col-lg-4'}>
          <StatusAndCounts tournament={tournament} />
          <PurchasableItems tournament={tournament} />
        </div>

        <div className={'col-12 col-md-6 col-lg-4'}>
          <TournamentLogo tournament={tournament} />
          <StateChangeButton tournament={tournament}
                             stateChangeInitiated={stateChangeInitiated} />
          <Contacts tournament={tournament} />
        </div>
      </div>
    </div>
  );
}

export default tournamentDetails;