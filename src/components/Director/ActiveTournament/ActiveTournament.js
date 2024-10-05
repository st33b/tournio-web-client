import classes from './ActiveTournament.module.scss';
import Configuration from "./Configuration";
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
    <div className={classes.Tournament}>
      <div className={'row'}>
        {/* On small devices: one column.
            On devices medium-large (up to 1399px wide): two columns
            On XXL devices (>= 1400px wide): three columns.
        */}
        <div className={'col-12 col-md-6 col-xxl-4'}>
          <Configuration/>
          <RegistrationOptions/>
          <OptionalItems/>
          {/*  Toggles: */}
          {/*  - Shift full (multi-shift only) */}
          {/*  Add a shift / Edit shift details (multi-shift only) */}
          {!hasOneShift && (
            <MultipleShifts shifts={tournament.shifts}
                            unit={capacityUnit}/>
          )}

          {hasOneShift && (
            <OneShift unit={capacityUnit}/>
          )}
        </div>
        <div className={'col-12 col-md-6 col-xxl-4'}>
          <p>
            I am important links, data, and actions!
          </p>
          <LinksAndCounts/>
          <Downloads/>
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
        <div className={'col-12 offset-md-6 col-md-6 offset-xxl-0 col-xxl-4'}>
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

  );
}

export default ActiveTournament;
