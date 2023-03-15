import {useState} from "react";

import {useDirectorContext} from "../../../../../store/DirectorContext";
import {devConsoleLog} from "../../../../../utils";

import classes from '../../TournamentBuilder.module.scss';

const Shifts = ({style}) => {
  const {directorState, dispatch} = useDirectorContext();

  if (!style) {
    return '';
  }

  return (
    <div>
    {/* For one shift, all we need from the shift form is capacity. */}
    {/* For 2+ shifts, we need the whole form. */}

    {/* Decide how to handle mix-and-match when we get there. */}


    </div>
  );
}

export default Shifts;
