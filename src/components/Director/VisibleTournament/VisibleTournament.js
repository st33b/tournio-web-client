import {Accordion, Card} from "react-bootstrap";

import Basics from './Basics';
import Logo from "./Logo";
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import Capacity from './Capacity';
import CloseTournament from "./CloseTournament";
import Counts from "./Counts";
import RegistrationOptions from "./RegistrationOptions";
import EditableConfiguration from "./EditableConfiguration";
import Contacts from "../TournamentDetails/Contacts";

import classes from './VisibleTournament.module.scss';
import PurchasableItems from "./PurchasableItems";
import Downloads from "./Downloads";
import RegistrationsWeek from "./Charts/RegistrationsWeek";
import RegistrationTypesWeek from "./Charts/RegistrationTypesWeek";
import DivisionItemsWeek from "./Charts/DivisionItemsWeek";
import OptionalItemsWeek from "./Charts/OptionalItemsWeek";
import MassActions from "../MassActions/MassActions";
import LogoImage from "../LogoImage/LogoImage";

const VisibleTournament = ({tournament, closeTournament}) => {
  if (!tournament) {
    return <div className={classes.VisibleTournament}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  const divisionNameSet = new Set();
  tournament.purchasable_items.division.forEach(({name}) => {
    divisionNameSet.add(name);
  });
  const divisionNames = Array.from(divisionNameSet);

  return (
    <div className={classes.VisibleTournament}>
      <div className={'row'}>

        <div className={'col-12 col-md-4 col-xl-3'}>
          <Counts tournament={tournament} />
          <RegistrationOptions tournament={tournament}/>
          <EditableConfiguration tournament={tournament} />
          <Downloads tournament={tournament}/>
          <MassActions tournament={tournament}/>
          {tournament.state === 'active' && (
            <>
              <hr />
              <CloseTournament tournament={tournament} closeTournament={closeTournament} />
            </>
          )}
        </div>

        <div className={'col-12 col-md-8 col-xl-6'}>
          <Capacity tournament={tournament} />
          <RegistrationsWeek tournament={tournament}/>
          <RegistrationTypesWeek tournament={tournament}/>
          {divisionNames.map(name => <DivisionItemsWeek tournament={tournament} title={name} key={name}/> )}
          <OptionalItemsWeek tournament={tournament} title={'Optional Events'} dataKeys={['bowling']}/>
          <OptionalItemsWeek tournament={tournament} title={'Extras'} dataKeys={['banquet', 'product']}/>
        </div>

        <div className={'col-12 col-md-4 col-xl-3'}>
          <LogoImage src={tournament.image_url} />

          <Card className={'text-center'} border={'0'}>
            <Card.Body>
              <a href={`/tournaments/${tournament.identifier}`} target={'_new'}>
                Front Page
                <i className={classes.ExternalLink + " bi-box-arrow-up-right"} aria-hidden="true"/>
              </a>
            </Card.Body>
          </Card>

          <Accordion className={'mb-3'}>
            <Basics eventKey={'0'} tournament={tournament}/>
            <Configuration eventKey={'1'} tournament={tournament} />
            <AdditionalQuestions eventKey={'2'} tournament={tournament}/>
            <PurchasableItems eventKey={'3'} tournament={tournament}/>
          </Accordion>

          <Contacts />
        </div>
      </div>
    </div>
  );
}

export default VisibleTournament;