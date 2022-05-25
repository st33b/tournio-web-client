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
import DeleteTournament from "./DeleteTournament";
import Shifts from "./Shifts";

const TournamentDetails = ({stateChangeInitiated, testEnvironmentUpdated}) => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return <div className={classes.TournamentDetails}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  return (
    <div className={classes.TournamentDetails}>
      <div className={'row'}>
        <div className={'col-12 col-md-6 col-lg-4'}>
          <Basics />
          <Configuration />
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