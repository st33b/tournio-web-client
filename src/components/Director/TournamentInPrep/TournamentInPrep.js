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

const TournamentInPrep = ({stateChangeInitiated, requestStripeStatus}) => {
  const {directorState} = useDirectorContext();

  if (!directorState.tournament) {
    return <div className={classes.TournamentInPrep}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  return (
    <ErrorBoundary>
      <div className={classes.TournamentInPrep}>
        <div className={'row'}>
          <div className={'col-12 col-md-6 col-lg-4'}>
            <Basics tournament={directorState.tournament}/>
            <ImageUpload tournament={directorState.tournament}/>
            <Contacts tournament={directorState.tournament}/>
            <Users users={directorState.tournament.users}/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <StatusAndCounts tournament={directorState.tournament}/>
            <StateChangeButton tournament={directorState.tournament} stateChangeInitiated={stateChangeInitiated} />
            <AdditionalQuestions tournament={directorState.tournament}/>
            <Shifts tournament={directorState.tournament}/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <Configuration tournament={directorState.tournament}/>
            <RegistrationOptions tournament={directorState.tournament}/>
            <PurchasableItems tournament={directorState.tournament}/>
            <StripeStatus tournament={directorState.tournament} needStatus={requestStripeStatus} />
            <DeleteTournament tournament={directorState.tournament}/>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default TournamentInPrep;
