import {Accordion, Card} from "react-bootstrap";

import Basics from './Basics';
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import Capacity from './Capacity';
import CloseTournament from "./CloseTournament";
import Counts from "./Counts";
import RegistrationOptions from "./RegistrationOptions";
import EditableConfiguration from "./EditableConfiguration";
import Contacts from "../TournamentInPrep/Contacts";

import classes from './VisibleTournament.module.scss';
import PurchasableItems from "./PurchasableItems";
import Downloads from "./Downloads";
import RegistrationsWeek from "./Charts/RegistrationsWeek";
import RegistrationTypesWeek from "./Charts/RegistrationTypesWeek";
import DivisionItemsWeek from "./Charts/DivisionItemsWeek";
import OptionalItemsWeek from "./Charts/OptionalItemsWeek";
import MassActions from "../MassActions/MassActions";
import LogoImage from "../LogoImage/LogoImage";
import {useDirectorContext} from "../../../store/DirectorContext";
import DeleteTournament from "./DeleteTournament";

const VisibleTournament = ({closeTournament}) => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return <div className={classes.VisibleTournament}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  const divisionNameSet = new Set();
  context.tournament.purchasable_items.division.forEach(({name}) => {
    divisionNameSet.add(name);
  });
  const divisionNames = Array.from(divisionNameSet);

  return (
    <div className={classes.VisibleTournament}>
      <div className={'row'}>

        <div className={'col-12 col-md-4 col-xl-3'}>
          <Counts tournament={context.tournament} />
          <RegistrationOptions tournament={context.tournament}/>
          <EditableConfiguration tournament={context.tournament} />
          <Downloads tournament={context.tournament}/>
          <MassActions tournament={context.tournament}/>
          {context.tournament.state === 'active' && (
            <>
              <hr />
              <CloseTournament tournament={context.tournament} closeTournament={closeTournament} />
            </>
          )}
          {context.tournament.state === 'closed' && (<DeleteTournament tournament={context.tournament}/>)}
        </div>

        <div className={'col-12 col-md-8 col-xl-6'}>
          <Capacity tournament={context.tournament} />
          <RegistrationsWeek tournament={context.tournament}/>
          <RegistrationTypesWeek tournament={context.tournament}/>
          {divisionNames.map(name => <DivisionItemsWeek tournament={context.tournament} title={name} key={name}/> )}
          <OptionalItemsWeek tournament={context.tournament} title={'Optional Events'} dataKeys={['bowling']}/>
          <OptionalItemsWeek tournament={context.tournament} title={'Extras'} dataKeys={['banquet', 'product']}/>
        </div>

        <div className={'col-12 col-md-4 col-xl-3'}>
          <LogoImage src={context.tournament.image_url} />

          <Card className={'text-center'} border={'0'}>
            <Card.Body>
              <a href={`/tournaments/${context.tournament.identifier}`} target={'_new'}>
                Front Page
                <i className={classes.ExternalLink + " bi-box-arrow-up-right"} aria-hidden="true"/>
              </a>
            </Card.Body>
          </Card>

          <Accordion className={'mb-3'}>
            <Basics eventKey={'0'} tournament={context.tournament}/>
            <Configuration eventKey={'1'} tournament={context.tournament} />
            <AdditionalQuestions eventKey={'2'} tournament={context.tournament}/>
            <PurchasableItems eventKey={'3'} tournament={context.tournament}/>
          </Accordion>

          <Contacts tournament={context.tournament}/>
        </div>
      </div>
    </div>
  );
}

export default VisibleTournament;