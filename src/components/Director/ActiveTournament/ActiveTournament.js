import {useDirectorContext} from "../../../store/DirectorContext";
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

const ActiveTournament = ({closeTournament}) => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return <div className={classes.ActiveTournament}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  return (
    <div className={classes.ActiveTournament}>
      <div className={'row'}>
        <div className={'col-12 col-md-6 col-lg-4'}>
          <Logo tournament={context.tournament} />
          <CloseTournament closeTournament={closeTournament} />
          <Accordion>
            <Basics />
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