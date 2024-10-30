import classes from './ActiveTournament.module.scss';
import ControlPanel from "./ControlPanel";
import RegistrationOptions from "./RegistrationOptions";
import OptionalItems from "./OptionalItems";
import RegistrationsWeek from "./Charts/RegistrationsWeek";
import RegistrationTypesWeek from "./Charts/RegistrationTypesWeek";
import LinksAndCounts from "./LinksAndCounts";
import Downloads from "./Downloads";
import {useLoginContext} from "../../../store/LoginContext";
import {updateObject} from "../../../utils";
import {useState} from "react";
import OneShift from "./OneShift";
import MultipleShifts from "./MultipleShifts";
import DivisionItemsWeek from "./Charts/DivisionItemsWeek";
import OptionalItemsWeek from "./Charts/OptionalItemsWeek";
import Link from "next/link";
import Contacts from "./Contacts";

const ActiveTournament = ({tournament, onCloseClicked, onDeleteClicked}) => {
  const {user} = useLoginContext();

  const [panelState, setPanelState] = useState({
    deleteProcessing: false,
  })

  const confirmClose = (event) => {
    event.preventDefault();
    if (confirm('This step is irreversible. Are you sure?')) {
      onCloseClicked();
    }
  }

  const confirmDelete = (event) => {
    event.preventDefault();
    if (confirm('This will delete the tournament and all its data. Are you sure?')) {
      setPanelState(updateObject({
        deleteProcessing: true,
      }));
      onDeleteClicked();
    }
  }

  const capacityUnit = tournament.events.some(event => event.rosterType === 'team') ? 'teams' : 'bowlers';
  const hasOneShift = tournament.shifts.length === 1;

  const divisionNameSet = new Set();
  tournament.purchasableItems.filter(({refinement}) => refinement === 'division').forEach(({name}) => {
    divisionNameSet.add(name);
  });
  const divisionNames = Array.from(divisionNameSet);

  return (
    <div className={classes.ActiveTournament}>
      <div className={`d-flex align-items-center align-items-lg-start ${classes.Title}`}>
        <img className={'col-2 col-xl-1 img-fluid'}
             src={tournament.imageUrl}
             alt={'Tournament logo'}/>
        <h1 className={'ms-3 display-5'}>
          {tournament.name} ({tournament.year})
        </h1>
      </div>

      {/* On small devices: one column.
          On medium and large devices (up to 1199px wide): two columns
          On XL devices (>= 1200px wide): three columns.
      */}
      <div className={'row'}>
        <div className={'col-12 col-md-6 col-xl-4'}>
          <h4
            className={`d-md-none py-3 text-center fw-normal ${tournament.state === 'active' ? 'text-bg-success' : 'text-bg-secondary'}`}>
            Registration is {tournament.state === 'active' ? 'open' : 'closed'}
          </h4>

          <ControlPanel configItems={tournament.configItems}/>
          <OptionalItems purchasableItems={tournament.purchasableItems}/>
        </div>

        {/* Stuff in column 2 (and 3, on XL+) */}
        <div className={'col-12 col-md-6 col-xl-8'}>
          <div className={'row'}>
            <div className={'col-12 col-xl-6'}>
              <h4
                className={`d-none d-md-block py-3 text-center fw-normal ${tournament.state === 'active' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                Registration is {tournament.state === 'active' ? 'open' : 'closed'}
              </h4>

              <div className={'text-center my-3'}>
                <Link href={`/tournaments/${tournament.identifier}`} target={'_blank'}>
                  Front Page
                  <i className={classes.ExternalLink + " bi-box-arrow-up-right"} aria-hidden="true"/>
                </Link>
              </div>

              <LinksAndCounts tournament={tournament}/>

              {tournament.state === 'active' && (
                <RegistrationOptions rosterTypes={tournament.events.map(e => e.rosterType)}
                                     options={tournament.registrationOptions}
                />
              )}

              <Downloads tournament={tournament}/>
              <Contacts tournament={tournament}/>

              <div className={'d-flex justify-content-between my-5'}>
                <div className={''}>
                  Payment Reminder Email
                </div>
                <div className={''}>
                  <button className={"btn btn-warning disabled"}
                          onClick={() => {
                          }}>
                    Send
                  </button>
                </div>
              </div>

              {tournament.state === 'active' && (
                <div className={'col-12 text-center mb-5'}>
                  <button className={'btn btn-lg btn-danger'}
                          onClick={confirmClose}>
                    Close Registration
                  </button>
                </div>
              )}

              {/* delete-tournament button */}
              {tournament.state === 'closed' && user.role === 'superuser' && (
                <div className="row my-3">
                  <div className={"col-12 text-center"}>
                    <button className={`btn btn-lg btn-danger ms-3 ${panelState.deleteProcessing ? 'disabled' : ''}`}
                            onClick={confirmClose}>
                      {panelState.deleteProcessing && (
                        <span>
                      <span className={'spinner-border spinner-border-sm me-2'}
                            role={'status'}
                            aria-hidden={true}></span>
                    </span>
                      )}
                      {!panelState.deleteProcessing && (
                        <i className={'bi bi-x-lg me-2'} aria-hidden="true">
                        </i>
                      )}
                      Delete Tournament
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={'col'}>
              {hasOneShift && (
                <OneShift shift={tournament.shifts[[0]]} unit={capacityUnit}/>
              )}
              {!hasOneShift && (
                <MultipleShifts shifts={tournament.shifts}
                                unit={capacityUnit}/>
              )}

              <RegistrationsWeek tournament={tournament}/>
              <RegistrationTypesWeek tournament={tournament}/>
              {divisionNames.map(name => <DivisionItemsWeek tournament={tournament} title={name} key={name}/> )}
              <OptionalItemsWeek tournament={tournament}
                                 title={'Optional Events'}
                                 dataKeys={['bowling']}/>
              <OptionalItemsWeek tournament={tournament}
                                 title={'Extras'}
                                 dataKeys={['banquet', 'product']}/>

              {/*  Transaction search input */}
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}

export default ActiveTournament;
