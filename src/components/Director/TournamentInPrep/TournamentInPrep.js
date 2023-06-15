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

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentInPrep.module.scss';
import RegistrationOptions from "../RegistrationOptions/RegistrationOptions";
import ErrorBoundary from "../../common/ErrorBoundary";
import LoadingMessage from "../../ui/LoadingMessage/LoadingMessage";

const TournamentInPrep = ({stateChangeInitiated, requestStripeStatus}) => {
  const {state} = useDirectorContext();

  if (!state || !state.tournament) {
    return '';
  }

  return (
    <ErrorBoundary>
      <div className={classes.TournamentInPrep}>
        <div className={'row'}>
          <div className={'col-12 col-md-6 col-lg-4'}>
            <Basics tournament={state.tournament}/>
            <ImageUpload tournament={state.tournament}/>
            <Contacts tournament={state.tournament}/>
            <Users users={state.tournament.users}/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <StatusAndCounts tournament={state.tournament}/>
            <StateChangeButton tournament={state.tournament} stateChangeInitiated={stateChangeInitiated} />
            <AdditionalQuestions tournament={state.tournament}/>
            <Shifts tournament={state.tournament}/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <Configuration tournament={state.tournament}/>
            <RegistrationOptions tournament={state.tournament}/>
            <PurchasableItems tournament={state.tournament}/>
            <StripeStatus tournament={state.tournament} needStatus={requestStripeStatus} />
            <DeleteTournament tournament={state.tournament}/>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default TournamentInPrep;
