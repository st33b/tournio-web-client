import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {devConsoleLog, updateObject} from "../../../../utils";
import {directorApiRequest} from "../../../../director";
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";
import {useDirectorContext} from "../../../../store/DirectorContext";
import Style from "./ShiftsSteps/Style";
import ShiftForm from "./ShiftsSteps/ShiftForm";

import classes from '../TournamentBuilder.module.scss';

const Shifts = ({substep}) => {
  const router = useRouter();
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const INITIAL_SHIFT_STATE = {
    name: '',
    description: '',
    capacity: 0,
    display_order: 1,
  };

  {/* Decide how to handle mix-and-match when we get there. */}

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
    if (!chosenStyle) {
      return;
    }
    if (chosenStyle === 'one') {
      setValid(isValid(singleShift));
    } else if (chosenStyle === 'multi_inclusive') {
      setValid(shiftSet.every(isValid));
    }
  }, [chosenStyle]);

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

  let formContent = '';
  if (displayedSubstep === 'shift_forms') {
    if (chosenStyle === 'one') {
      formContent = <ShiftForm withDetails={false}
                               shift={singleShift}
                               onShiftUpdated={shiftUpdated}/>;
    }
    if (chosenStyle === 'multi_inclusive') {
      formContent = shiftSet.map((shift, i) => <ShiftForm key={i}
                                                          index={i}
                                                          withDetails={true}
                                                          shift={shift}
                                                          onShiftDeleted={i > 1 ? () => shiftDeleted(i) : undefined}
                                                          onShiftUpdated={(newShift) => shiftUpdated(newShift, i)}/>);
    }
  }

  const addShiftClicked = () => {
    const newShiftSet = shiftSet.concat(INITIAL_SHIFT_STATE);
    setShiftSet(newShiftSet);
    setValid(false);
  }

  return (
    <div>
      <h2>{directorState.builder.tournament.name}: Shifts</h2>

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

      {/*<div className={`row ${classes.ButtonRow}`}>*/}
      {/*  <div className={`col-12 d-flex justify-content-end`}>*/}
      {/*    <button className={`btn btn-primary`}*/}
      {/*            disabled={true}*/}
      {/*            onClick={() => {}}*/}
      {/*    >*/}
      {/*      Next*/}
      {/*      <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}

export default Shifts
