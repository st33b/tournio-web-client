import {Accordion, Card} from "react-bootstrap";
import Link from "next/link";

import Basics from './Basics';
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import Capacity from './Capacity';
import CloseTournament from "./CloseTournament";
import Counts from "./Counts";
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
import Users from "../Tournament/Users";
import Shifts from "../TournamentInPrep/Shifts";

import classes from './VisibleTournament.module.scss';

const VisibleTournament = ({tournament, closeTournament}) => {
  const EDITABLE_CONFIG_ITEMS = [
    "display_capacity",
    "publicly_listed",
    "email_in_dev",
    "skip_stripe",
  ];

  if (!tournament) {
    return '';
  }

  const divisionNameSet = new Set();
  tournament.purchasable_items.division.forEach(({name}) => {
    divisionNameSet.add(name);
  });
  const divisionNames = Array.from(divisionNameSet);

  const lessImportantStuff = (
    <>
      <Downloads tournament={tournament}/>
      <Accordion className={'mb-3'}>
        <Basics eventKey={'0'} tournament={tournament}/>
        <Configuration eventKey={'1'}
                       tournament={tournament}
                       excludedKeys={EDITABLE_CONFIG_ITEMS} />
        <AdditionalQuestions eventKey={'2'} tournament={tournament}/>
        <PurchasableItems eventKey={'3'} tournament={tournament}/>
      </Accordion>

      <Contacts tournament={tournament}/>
      <Users users={tournament.users}/>

      {tournament.state === 'active' && (
        <>
          <hr />
          <CloseTournament tournament={tournament} closeTournament={closeTournament} />
        </>
      )}
      {tournament.state === 'closed' && (<DeleteTournament tournament={tournament}/>)}
    </>
  );

  return (
    <div className={classes.VisibleTournament}>
      <div className={'row'}>

        <div className={'col-12 col-md-4 col-xl-3'}>

          {tournament.state === 'closed' && (
            <div className={`${classes.Closed} p-3 mb-3`}>
              <h5 className={'fw-light m-0'}>
                Registration is Closed
              </h5>
            </div>
          )}
          <LogoImage src={tournament.image_url} />
          <Card className={'text-center'} border={'0'}>
            <Card.Body>
              <Card.Title>
                {tournament.name}
              </Card.Title>
              <Link href={`/tournaments/${tournament.identifier}`} target={'_new'}>
                Front Page
                <i className={classes.ExternalLink + " bi-box-arrow-up-right"} aria-hidden="true"/>
              </Link>
            </Card.Body>
          </Card>

          <Counts tournament={tournament} />

          <Card className={'mb-3'}>
            <Card.Body className={'text-center'}>
              <Link href={`/director/tournaments/${tournament.identifier}/bowlers`}
                    className={'card-link'}>
                Bowlers (SWR)
              </Link>
            </Card.Body>
          </Card>

          <RegistrationOptions tournament={tournament}/>
          <EditableConfiguration tournament={tournament}
                                 editableKeys={EDITABLE_CONFIG_ITEMS} />
          <Shifts tournament={tournament} />
          <MassActions tournament={tournament}/>

          <div className={'d-none d-md-block d-lg-none'}>
            <hr />
            {lessImportantStuff}
          </div>
        </div>

        <div className={'col-12 col-md-8 col-lg-5 col-xl-6'}>
          <Capacity tournament={tournament} />
          <RegistrationsWeek tournament={tournament}/>
          <RegistrationTypesWeek tournament={tournament}/>
          {divisionNames.map(name => <DivisionItemsWeek tournament={tournament} title={name} key={name}/> )}
          <OptionalItemsWeek tournament={tournament}
                             title={'Optional Events'}
                             dataKeys={['bowling']}/>
          <OptionalItemsWeek tournament={tournament}
                             title={'Extras'}
                             dataKeys={['banquet', 'product']}/>
        </div>

        <div className={'d-md-none d-lg-block col-12 col-md-4 col-lg-3'}>
          {lessImportantStuff}
        </div>
      </div>
    </div>
  );
}

export default VisibleTournament;
