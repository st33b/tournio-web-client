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
import RegistrationOptions from "../Tournament/RegistrationOptions";
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
            <ImageUpload/>
            <Contacts/>
            <Users/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <StatusAndCounts/>
            <StateChangeButton stateChangeInitiated={stateChangeInitiated} />
            <AdditionalQuestions/>
            <Shifts/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <Configuration/>
            <RegistrationOptions/>
            <PurchasableItems/>
            <StripeStatus tournament={tournament} needStatus={requestStripeStatus} />
            <DeleteTournament tournament={tournament}/>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default TournamentInPrep;
