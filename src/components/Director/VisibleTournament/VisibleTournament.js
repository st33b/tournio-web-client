import {Accordion, Card} from "react-bootstrap";

import Basics from './Basics';
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import Capacity from './Capacity';
import CloseTournament from "./CloseTournament";
import Counts from "./Counts";
// import RegistrationOptions from "./RegistrationOptions";
import RegistrationOptions from "../RegistrationOptions/RegistrationOptions";
import EditableConfiguration from "./EditableConfiguration";
import Contacts from "../Tournament/Contacts";
import PurchasableItems from "./PurchasableItems";
import Downloads from "./Downloads";
import RegistrationsWeek from "./Charts/RegistrationsWeek";
import RegistrationTypesWeek from "./Charts/RegistrationTypesWeek";
import DivisionItemsWeek from "./Charts/DivisionItemsWeek";
import OptionalItemsWeek from "./Charts/OptionalItemsWeek";
import MassActions from "../MassActions/MassActions";
import LogoImage from "../LogoImage/LogoImage";
import DeleteTournament from "../Tournament/DeleteTournament";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './VisibleTournament.module.scss';
import Users from "../Tournament/Users";

const VisibleTournament = ({closeTournament}) => {
  const {directorState} = useDirectorContext();

  if (!directorState || !directorState.tournament) {
    return <div className={classes.VisibleTournament}>
      <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
    </div>;
  }

  const divisionNameSet = new Set();
  directorState.tournament.purchasable_items.division.forEach(({name}) => {
    divisionNameSet.add(name);
  });
  const divisionNames = Array.from(divisionNameSet);

  const lessImportantStuff = (
    <>
      <Downloads tournament={directorState.tournament}/>
      <Accordion className={'mb-3'}>
        <Basics eventKey={'0'} tournament={directorState.tournament}/>
        <Configuration eventKey={'1'} tournament={directorState.tournament} />
        <AdditionalQuestions eventKey={'2'} tournament={directorState.tournament}/>
        <PurchasableItems eventKey={'3'} tournament={directorState.tournament}/>
      </Accordion>

      <Contacts tournament={directorState.tournament}/>
      <Users users={directorState.tournament.users}/>

      {directorState.tournament.state === 'active' && (
        <>
          <hr />
          <CloseTournament tournament={directorState.tournament} closeTournament={closeTournament} />
        </>
      )}
      {directorState.tournament.state === 'closed' && (<DeleteTournament tournament={directorState.tournament}/>)}
    </>
  );

  return (
    <div className={classes.VisibleTournament}>
      <div className={'row'}>

        <div className={'col-12 col-md-4 col-xl-3'}>

          {directorState.tournament.state === 'closed' && (
            <div className={`${classes.Closed} p-3 mb-3`}>
              <h5 className={'fw-light m-0'}>
                Registration is Closed
              </h5>
            </div>
          )}
          <LogoImage src={directorState.tournament.image_url} />
          <Card className={'text-center'} border={'0'}>
            <Card.Body>
              <Card.Title>
                {directorState.tournament.name}
              </Card.Title>
              <a href={`/tournaments/${directorState.tournament.identifier}`} target={'_new'}>
                Front Page
                <i className={classes.ExternalLink + " bi-box-arrow-up-right"} aria-hidden="true"/>
              </a>
            </Card.Body>
          </Card>

          <Counts tournament={directorState.tournament} />
          <RegistrationOptions tournament={directorState.tournament}/>
          <EditableConfiguration tournament={directorState.tournament} />
          <MassActions tournament={directorState.tournament}/>

          <div className={'d-none d-md-block d-lg-none'}>
            <hr />
            {lessImportantStuff}
          </div>
        </div>

        <div className={'col-12 col-md-8 col-lg-5 col-xl-6'}>
          <Capacity tournament={directorState.tournament} />
          <RegistrationsWeek tournament={directorState.tournament}/>
          <RegistrationTypesWeek tournament={directorState.tournament}/>
          {divisionNames.map(name => <DivisionItemsWeek tournament={directorState.tournament} title={name} key={name}/> )}
          <OptionalItemsWeek tournament={directorState.tournament} title={'Optional Events'} dataKeys={['bowling']}/>
          <OptionalItemsWeek tournament={directorState.tournament} title={'Extras'} dataKeys={['banquet', 'product']}/>
        </div>

        <div className={'d-md-none d-lg-block col-12 col-md-4 col-lg-3'}>
          {lessImportantStuff}
        </div>
      </div>
    </div>
  );
}

export default VisibleTournament;
