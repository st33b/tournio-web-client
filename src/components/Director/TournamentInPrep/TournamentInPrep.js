import {useDirectorContext} from "../../../store/DirectorContext";
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

import classes from './TournamentInPrep.module.scss';
import ImageUpload from "./ImageUpload";
import LogoImage from "../LogoImage/LogoImage";

const TournamentInPrep = ({stateChangeInitiated, testEnvironmentUpdated, requestStripeStatus}) => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return <div className={classes.TournamentInPrep}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  return (
    <div className={classes.TournamentInPrep}>
      <div className={'row'}>
        <div className={'col-12 col-md-6 col-lg-4'}>
          <Basics tournament={context.tournament}/>
          <Configuration tournament={context.tournament}/>
          <Shifts tournament={context.tournament}/>
          <AdditionalQuestions tournament={context.tournament}/>
        </div>

        <div className={'col-12 col-md-6 col-lg-4'}>
          <StatusAndCounts testEnvironmentUpdated={testEnvironmentUpdated} tournament={context.tournament}/>
          <StateChangeButton tournament={context.tournament} stateChangeInitiated={stateChangeInitiated} />
          <PurchasableItems tournament={context.tournament}/>
          <StripeStatus tournament={context.tournament} needStatus={requestStripeStatus} />
        </div>

        <div className={'col-12 col-md-6 col-lg-4'}>
          <ImageUpload tournament={context.tournament}/>
          <Contacts tournament={context.tournament}/>
          {context.tournament.state !== 'active' && <DeleteTournament />}
        </div>
      </div>
    </div>
  );
}

export default TournamentInPrep;