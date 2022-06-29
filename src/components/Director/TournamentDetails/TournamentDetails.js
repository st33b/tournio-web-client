import {useDirectorContext} from "../../../store/DirectorContext";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Basics from "./Basics";
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import TournamentLogo from "./TournamentLogo";
import StatusAndCounts from "./StatusAndCounts";
import PurchasableItems from "./PurchasableItems";
import Contacts from "./Contacts";
import StateChangeButton from "./StateChangeButton";
import DeleteTournament from "./DeleteTournament";
import Shifts from "./Shifts";
import StripeStatus from "./StripeStatus";

import classes from './TournamentDetails.module.scss';

const TournamentDetails = ({stateChangeInitiated, testEnvironmentUpdated, requestStripeStatus}) => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return <div className={classes.TournamentDetails}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  const ladder = [{ text: 'Tournaments', path: '/director' }];
  return (
    <div className={classes.TournamentDetails}>
      <Breadcrumbs ladder={ladder} activeText={context.tournament.name} className={classes.Breadcrumbs} />

      <div className={'row'}>
        <div className={'col-12 col-md-6 col-lg-4'}>
          <Basics />
          <Configuration />
          <StripeStatus tournament={context.tournament} needStatus={requestStripeStatus} />
          <AdditionalQuestions />
          <Shifts />
        </div>

        <div className={'col-12 col-md-6 col-lg-4'}>
          <StatusAndCounts testEnvironmentUpdated={testEnvironmentUpdated}/>
          <PurchasableItems />
        </div>

        <div className={'col-12 col-md-6 col-lg-4'}>
          <TournamentLogo tournament={context.tournament} />
          <StateChangeButton stateChangeInitiated={stateChangeInitiated} />
          <Contacts />
          {context.tournament.state !== 'active' && <DeleteTournament />}
        </div>
      </div>
    </div>
  );
}

export default TournamentDetails;