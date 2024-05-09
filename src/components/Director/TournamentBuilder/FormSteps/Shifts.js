import React, {useEffect, useState} from "react";

import {devConsoleLog, updateObject} from "../../../../utils";
import {directorApiRequest, useModernTournament} from "../../../../director";
import {
  newTournamentCompleted,
  newTournamentSaved
} from "../../../../store/actions/directorActions";
import {useDirectorContext} from "../../../../store/DirectorContext";
import Style from "./ShiftsSteps/Style";
import ShiftForm from "./ShiftsSteps/ShiftForm";

import classes from '../TournamentBuilder.module.scss';
import {useLoginContext} from "../../../../store/LoginContext";
import {useRouter} from "next/router";

const Shifts = ({substep}) => {
  const {state, dispatch} = useDirectorContext();
  const {authToken} = useLoginContext();
  const router = useRouter();

  const INITIAL_SHIFT_STATE = {
    event_ids: [],
    name: '',
    description: '',
    capacity: '',
    display_order: 1,
  };

  const [displayedSubstep, setDisplayedSubstep] = useState();
  const [chosenStyle, setChosenStyle] = useState();
  const [singleShift, setSingleShift] = useState(INITIAL_SHIFT_STATE);
  const [shiftSet, setShiftSet] = useState(new Array(2).fill(INITIAL_SHIFT_STATE));
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (substep) {
      setDisplayedSubstep(substep);
    } else {
      setDisplayedSubstep('style');
    }
  }, [substep]);

  useEffect(() => {
    if (!state.builder) {
      return;
    }
    if (chosenStyle === 'one') {
      setSingleShift(updateObject(singleShift, {
        event_ids: state.builder.tournament.events.map(({id}) => id),
      }));
      setValid(isValid(singleShift));
    } else if (chosenStyle === 'multi_inclusive') {
      const updatedSet = [];
      shiftSet.forEach(s => {
        updatedSet.push(updateObject(s, {
          event_ids: state.builder.tournament.events.map(({id}) => id),
        }));
      });
      setShiftSet(updatedSet);
      setValid(shiftSet.every(isValid));
    }
  }, [chosenStyle, state.builder]);

  const handleStyleSelection = (style) => {
    setChosenStyle(style);
    switch (style) {
      case 'one':
        // set substep to shifts, and require capacity for a single shift
        setDisplayedSubstep('shift_forms');
        break;
      case 'multi_inclusive':
        // Set substep to shifts, and require all data for 2+ shifts, disabling events input
        setDisplayedSubstep('shift_forms');
        break;
      case 'mix_and_match':
        // Set substep to shifts, and require all data for 2+ shifts, including event selection
        setDisplayedSubstep('shift_forms');
        break;
      default:
        // uhh, that's nice...
        setChosenStyle(null);
        setDisplayedSubstep('style');
    }
  }

  const isValid = (shift) => {
    return shift.capacity > 0
      && (chosenStyle === 'one' || shift.name.length > 0 && shift.display_order > 0);
  }

  const shiftUpdated = (updatedShift, index) => {
    if (index === undefined) {
      // single shift
      const newShift = updateObject(singleShift, updatedShift);
      setSingleShift(newShift);
      setValid(isValid(newShift));
    } else {
      // one of the set
      const newShiftSet = [...shiftSet];
      newShiftSet[index] = updateObject(shiftSet[index], updatedShift);
      setShiftSet(newShiftSet);
      setValid(newShiftSet.every(isValid));
    }
  }

  const shiftDeleted = (i) => {
    const newShiftSet = shiftSet.filter((elem, index) => index !== i);
    setShiftSet(newShiftSet);
    setValid(newShiftSet.every(isValid));
  }

  const addShiftClicked = () => {
    const newShiftSet = shiftSet.concat(INITIAL_SHIFT_STATE);
    setShiftSet(newShiftSet);
    setValid(false);
  }

  const onSuccess = (data) => {
    const newTournamentIdentifier = state.builder.tournament.identifier;
    dispatch(newTournamentSaved(data));
    // dispatch(newTournamentStepCompleted('shifts', 'scoring'));
    dispatch(newTournamentCompleted());
    router.push(`/director/tournaments/${newTournamentIdentifier}`);
  }

  const onFailure = (data) => {
    devConsoleLog("Failed to save the shifts :(", data);
  }

  const nextClicked = () => {
    // build the data to send
    let shiftData = [];
    if (chosenStyle === 'one') {
      shiftData.push(singleShift);
    } else {
      shiftData = [...shiftSet];
    }

    // send it up, with success/failure handlers
    const identifier = state.builder.tournament.identifier;
    const uri = `/tournaments/${identifier}`;
    const requestData = {
      tournament: {
        shifts_attributes: shiftData,
      }
    };
    const requestConfig = {
      method: 'patch',
      data: requestData,
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: onSuccess,
      onFailure: onFailure,
    });
  }

  ////////////////////////////////////////////////////////////////

  if (!state.builder) {
    return '';
  }

  let formContent = '';
  if (displayedSubstep === 'shift_forms') {
    if (chosenStyle === 'one') {
      formContent = <ShiftForm withDetails={false}
                               shift={singleShift}
                               onShiftUpdated={shiftUpdated}/>;
    }
    else if (chosenStyle === 'multi_inclusive') {
      formContent = shiftSet.map((shift, i) => <ShiftForm key={i}
                                                          index={i}
                                                          withDetails={true}
                                                          shift={shift}
                                                          onShiftDeleted={i > 1 ? () => shiftDeleted(i) : undefined}
                                                          onShiftUpdated={(newShift) => shiftUpdated(newShift, i)}/>);
    }
    else if (chosenStyle === 'mix_and_match') {
      formContent = shiftSet.map((shift, i) => <ShiftForm key={i}
                                                          index={i}
                                                          withDetails={true}
                                                          allEvents={state.builder.tournament.events}
                                                          shift={shift}
                                                          onShiftDeleted={i > 1 ? () => shiftDeleted(i) : undefined}
                                                          onShiftUpdated={(newShift) => shiftUpdated(newShift, i)}/>);
    }
  }

  return (
    <div>
      <h2>{state.builder.tournament.name}: Shifts</h2>

      <Style style={chosenStyle} styleChosen={handleStyleSelection}/>

      {formContent}

      {displayedSubstep === 'shift_forms' && chosenStyle !== 'one' && (
        <div className={`row ${classes.FieldRow}`}>
          <div className={'col text-center'}>
            <button type={'button'}
                    className={'btn btn-sm btn-outline-secondary'}
                    name={'addEvent'}
                    onClick={addShiftClicked}>
              <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
              Add Shift
            </button>
          </div>
        </div>
      )}

      <div className={`row ${classes.ButtonRow}`}>
        <div className={`col-12 d-flex justify-content-end`}>
          <button className={`btn btn-primary`}
                  disabled={!valid}
                  onClick={nextClicked}
          >
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Shifts
