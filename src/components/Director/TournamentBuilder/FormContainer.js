import {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {useDirectorContext} from "../../../store/DirectorContext";

import Name from './FormSteps/Name';
import Details from "./FormSteps/Details";
import Dates from './FormSteps/Dates';
import Logo from "./FormSteps/Logo";
import Shifts from './FormSteps/Shifts';
import Scoring from "./FormSteps/Scoring";
import RequiredEvents from "./FormSteps/RequiredEvents";
import AdditionalEvents from "./FormSteps/AdditionalEvents";
import DerivedEvents from "./FormSteps/DerivedEvents";

import classes from './TournamentBuilder.module.scss';

const FormContainer = ({activeStep}) => {
  const router = useRouter();
  const {directorState, dispatch} = useDirectorContext();

  if (!activeStep) {
    return '';
  }

  return (
    <div className={classes.FormContainer}>
      {activeStep === 'name' && <Name nextStep={'details'}/>}
      {activeStep === 'details' && <Details/>}
      {activeStep === 'dates' && <Dates/>}
      {activeStep === 'logo' && <Logo/>}
      {activeStep === 'shifts' && <Shifts/>}
      {activeStep === 'scoring' && <Scoring/>}
      {activeStep === 'required_events' && <RequiredEvents/>}
      {activeStep === 'additional_events' && <AdditionalEvents/>}
      {activeStep === 'derived_events' && <DerivedEvents/>}
    </div>
  );
}

export default FormContainer;
