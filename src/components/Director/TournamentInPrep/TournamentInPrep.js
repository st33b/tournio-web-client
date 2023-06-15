import DeleteTournament from "../Tournament/DeleteTournament";

import Basics from "./Basics";
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import StatusAndCounts from "./StatusAndCounts";
import PurchasableItems from "./PurchasableItems";
import Contacts from "../Tournament/Contacts";
import StateChangeButton from "./StateChangeButton";
import Shifts from "./Shifts";
import StripeStatus from "./StripeStatus";
import ImageUpload from "./ImageUpload";
import Users from '../Tournament/Users';
import RegistrationOptions from "../RegistrationOptions/RegistrationOptions";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './TournamentInPrep.module.scss';

const TournamentInPrep = ({tournament, stateChangeInitiated, requestStripeStatus}) => {
  if (!tournament) {
    return '';
  }

  return (
    <ErrorBoundary>
      <div className={classes.TournamentInPrep}>
        <div className={'row'}>
          <div className={'col-12 col-md-6 col-lg-4'}>
            <Basics tournament={tournament}/>
            <ImageUpload tournament={tournament}/>
            <Contacts tournament={tournament}/>
            <Users users={tournament.users}/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <StatusAndCounts tournament={tournament}/>
            <StateChangeButton tournament={tournament} stateChangeInitiated={stateChangeInitiated} />
            <AdditionalQuestions tournament={tournament}/>
            <Shifts tournament={tournament}/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <Configuration tournament={tournament}/>
            <RegistrationOptions tournament={tournament}/>
            <PurchasableItems tournament={tournament}/>
            <StripeStatus tournament={tournament} needStatus={requestStripeStatus} />
            <DeleteTournament tournament={tournament}/>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default TournamentInPrep;
