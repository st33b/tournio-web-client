import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {devConsoleLog} from "../../../../utils";
import {directorApiRequest} from "../../../../director";
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";
import {useDirectorContext} from "../../../../store/DirectorContext";
import Style from "./ShiftsSteps/Style";

import classes from '../TournamentBuilder.module.scss';

const Shifts = ({substep}) => {
  const router = useRouter();
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const [displayedSubstep, setDisplayedSubstep] = useState();
  const [chosenStyle, setChosenStyle] = useState();

  useEffect(() => {
    if (substep) {
      setDisplayedSubstep(substep);
    } else {
      setDisplayedSubstep('style');
    }
  }, [substep]);

  const handleStyleSelection = (style) => {
    setChosenStyle(style);
    switch (style) {
      case 'one':
        // set substep to shifts, and require capacity for a single shift
        break;
      case 'multi_inclusive':
        // Set substep to shifts, and require all data for 2+ shifts, disabling events input
        break;
      case 'mix_and_match':
        // Set substep to shifts, and require all data for 2+ shifts, including event selection
        break;
      default:
        // uhh, that's nice...
        setChosenStyle(null);
    }
  }

  return (
    <div>
      <h2>{directorState.builder.tournament.name}: Shifts</h2>

      {displayedSubstep === 'style' && <Style style={chosenStyle} styleChosen={handleStyleSelection}/>}

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
