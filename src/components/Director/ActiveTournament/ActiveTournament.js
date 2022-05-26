import {Accordion} from "react-bootstrap";

import Basics from './Basics';
import Logo from "./Logo";
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import Capacity from './Capacity';
import CloseTournament from "./CloseTournament";

// import StatusAndCounts from "./StatusAndCounts";
// import PurchasableItems from "./PurchasableItems";
// import Contacts from "./Contacts";
// import Shifts from "./Shifts";

import classes from './ActiveTournament.module.scss';
import Counts from "./Counts";
import RegistrationOptions from "./RegistrationOptions";
import EditableConfiguration from "./EditableConfiguration";
import Contacts from "../TournamentDetails/Contacts";

const ActiveTournament = ({tournament, closeTournament}) => {
  if (!tournament) {
    return <div className={classes.ActiveTournament}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  return (
    <div className={classes.ActiveTournament}>
      <div className={'row'}>

        <div className={'col-12 col-md-4 col-xl-3'}>
          <Counts tournament={tournament} />
          <RegistrationOptions tournament={tournament}/>
          <EditableConfiguration tournament={tournament} />
          <hr />
          <CloseTournament tournament={tournament} closeTournament={closeTournament} />
        </div>

        <div className={'col-12 col-md-8 col-xl-6'}>
          <Capacity tournament={tournament} />
        </div>

        <div className={'col-12 col-md-4 col-xl-3'}>
          <Logo src={tournament.image_path} />
          <Accordion className={'mb-3'}>
            <Basics eventKey={'0'} tournament={tournament}/>
            <Configuration eventKey={'1'} tournament={tournament} />
            <AdditionalQuestions eventKey={'2'} tournament={tournament}/>
            {/*<PurchasableItems />*/}
          </Accordion>

          <Contacts />
        </div>
      </div>
    </div>
  );
}

export default ActiveTournament;