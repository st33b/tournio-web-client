import classes from './ActiveTournament.module.scss';
import ControlPanel from "./ControlPanel";
import RegistrationOptions from "./RegistrationOptions";
import OptionalItems from "./OptionalItems";
import Capacity from "../VisibleTournament/Capacity";
import RegistrationsWeek from "../VisibleTournament/Charts/RegistrationsWeek";
import RegistrationTypesWeek from "../VisibleTournament/Charts/RegistrationTypesWeek";
import LinksAndCounts from "./LinksAndCounts";
import Downloads from "./Downloads";
import MassActions from "./MassActions";
import {useLoginContext} from "../../../store/LoginContext";
import {updateObject} from "../../../utils";
import {useState} from "react";
import OneShift from "./OneShift";
import MultipleShifts from "./MultipleShifts";

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

  return (
    <div className={classes.ActiveTournament}>
      <div className={`d-flex align-items-center align-items-lg-start ${classes.Title}`}>
        <img className={'col-2 col-xl-1 img-fluid'}
             src={tournament.imageUrl}
             alt={'Tournament logo'}/>
        <h1 className={'display-5'}>
          {tournament.name} ({tournament.year})
        </h1>
      </div>

      {/* On small devices: one column.
          On medium and large devices (up to 1199px wide): two columns
          On XL devices (>= 1200px wide): three columns.
      */}
      <div className={'row'}>
        <div className={'col-12 col-md-6 col-xl-4'}>
          <ControlPanel configItems={tournament.configItems}/>
          <RegistrationOptions rosterTypes={tournament.events.map(e => e.rosterType)}
                               options={tournament.registrationOptions}
          />
          <OptionalItems purchasableItems={tournament.purchasableItems}/>

          {hasOneShift && (
            <OneShift shift={tournament.shifts[[0]]} unit={capacityUnit}/>
          )}
          {!hasOneShift && (
            <MultipleShifts shifts={tournament.shifts}
                            unit={capacityUnit}/>
          )}
        </div>

        {/* Stuff in column 2 (and 3, on XL+) */}
        <div className={'col-12 col-md-6 col-xl-8'}>
          <div className={'row'}>
            <div className={'col-12 col-xl-6'}>
              <LinksAndCounts tournament={tournament}/>
              <Downloads tournament={tournament}/>
              <MassActions/>

              {tournament.state === 'active' && (
                <div className="row my-3">
                  <div className={"col-12 text-center"}>
                    <button className={"btn btn-lg btn-danger ms-3"}
                            onClick={confirmClose}>
                      Close Registration
                    </button>
                  </div>
                </div>
              )}
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
              <p>
                I am display data, and there will be a search input here!
              </p>
              <Capacity/>
              <RegistrationsWeek/>
              <RegistrationTypesWeek/>

              {/*  Transaction search input */}
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}

export default ActiveTournament;
