import Basics from "./Basics";
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import StatusAndCounts from "./StatusAndCounts";
import PurchasableItems from "./PurchasableItems";
import Contacts from "./Contacts";
import StateChangeButton from "./StateChangeButton";
import DeleteTournament from "./DeleteTournament";
import Shifts from "./Shifts";
import StripeStatus from "./StripeStatus";
import ImageUpload from "./ImageUpload";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentInPrep.module.scss';

const TournamentInPrep = ({stateChangeInitiated, requestStripeStatus}) => {
  const {directorState} = useDirectorContext();

  if (!directorState || !directorState.tournament) {
    return <div className={classes.TournamentInPrep}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  return (
    <div className={classes.TournamentInPrep}>
      <div className={'row'}>
        <div className={'col-12 col-md-6 col-lg-4'}>
          <Basics tournament={directorState.tournament}/>
          <Configuration tournament={directorState.tournament}/>
          <Shifts tournament={directorState.tournament}/>
          <AdditionalQuestions tournament={directorState.tournament}/>
        </div>

        <div className={'col-12 col-md-6 col-lg-4'}>
          <StatusAndCounts tournament={directorState.tournament}/>
          <StateChangeButton tournament={directorState.tournament} stateChangeInitiated={stateChangeInitiated} />
          <PurchasableItems tournament={directorState.tournament}/>
          <StripeStatus tournament={directorState.tournament} needStatus={requestStripeStatus} />
        </div>

        <div className={'col-12 col-md-6 col-lg-4'}>
          <ImageUpload tournament={directorState.tournament}/>
          <Contacts tournament={directorState.tournament}/>
          <DeleteTournament tournament={directorState.tournament}/>
        </div>
      </div>
    </div>
  );
}

export default TournamentInPrep;