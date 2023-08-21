import {Accordion, Card} from "react-bootstrap";
import Link from "next/link";

import Basics from './Basics';
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import Capacity from './Capacity';
import CloseTournament from "./CloseTournament";
import Counts from "./Counts";
import RegistrationOptions from "../Tournament/RegistrationOptions";
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
import {useTournament} from "../../../director";

import classes from './VisibleTournament.module.scss';

const VisibleTournament = ({closeTournament}) => {
  const EDITABLE_CONFIG_ITEMS = [
    "display_capacity",
    "publicly_listed",
    "accept_payments",
    "automatic_discount_voids",
    "email_in_dev",
    "skip_stripe",
  ];

  const {loading, tournament} = useTournament();

  if (loading) {
    return '';
  }

  const divisionNameSet = new Set();
  tournament.purchasable_items.division.forEach(({name}) => {
    divisionNameSet.add(name);
  });
  const divisionNames = Array.from(divisionNameSet);

  const lessImportantStuff = (
    <>
      <Downloads/>
      <Accordion className={'mb-3'}>
        <Basics eventKey={'0'}/>
        <Configuration eventKey={'1'}
                       excludedKeys={EDITABLE_CONFIG_ITEMS} />
        <AdditionalQuestions eventKey={'2'}/>
        <PurchasableItems eventKey={'3'}/>
      </Accordion>

      <Contacts/>
      <Users/>

      {tournament.state === 'active' && (
        <>
          <hr />
          <CloseTournament closeTournament={closeTournament} />
        </>
      )}
      {tournament.state === 'closed' && (
        <>
          <hr />
          <DeleteTournament/>
          </>
        )}
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

          <Counts/>

          <RegistrationOptions/>
          <EditableConfiguration editableKeys={EDITABLE_CONFIG_ITEMS} />
          <Shifts/>
          <MassActions/>

          <div className={'d-none d-md-block d-lg-none'}>
            <hr />
            {lessImportantStuff}
          </div>
        </div>

        <div className={'col-12 col-md-8 col-lg-5 col-xl-6'}>
          <Capacity/>
          <RegistrationsWeek/>
          <RegistrationTypesWeek/>
          {divisionNames.map(name => <DivisionItemsWeek title={name} key={name}/> )}
          <OptionalItemsWeek title={'Optional Events'}
                             dataKeys={['bowling']}/>
          <OptionalItemsWeek title={'Extras'}
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
