import Basics from './Basics';
// import Configuration from "./Configuration";
// import AdditionalQuestions from "./AdditionalQuestions";
import Logo from "./Logo";
import CloseTournament from "./CloseTournament";
// import StatusAndCounts from "./StatusAndCounts";
// import PurchasableItems from "./PurchasableItems";
// import Contacts from "./Contacts";
// import Shifts from "./Shifts";

import classes from './ActiveTournament.module.scss';
import {Accordion} from "react-bootstrap";
import Configuration from "./Configuration";

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
          <Logo src={tournament.image_path} />
          <CloseTournament closeTournament={closeTournament} />
          <Accordion className={'mb-3'}>
            <Basics eventKey={'0'} tournament={tournament}/>
            <Configuration eventKey={'1'} tournament={tournament} />
          </Accordion>

          {/*<Configuration />*/}
          {/*<AdditionalQuestions />*/}
          {/*<PurchasableItems />*/}
          {/*<Shifts />*/}
          {/*<Contacts />*/}
        </div>

        <div className={'col-12 col-md-6 col-lg-8'}>

        </div>
      </div>
    </div>
  );
}

export default ActiveTournament;