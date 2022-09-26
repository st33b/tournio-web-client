import {useRouter} from "next/router";
import {useDirectorContext} from "../../../store/DirectorContext";
import Name from './FormSteps/Name';
import Details from "./FormSteps/Details";
import Dates from './FormSteps/Dates';
import Logo from "./FormSteps/Logo";
import Scoring from "./FormSteps/Scoring";
import RequiredEvents from "./FormSteps/RequiredEvents";
import AdditionalEvents from "./FormSteps/AdditionalEvents";
import DerivedEvents from "./FormSteps/DerivedEvents";

import classes from './TournamentBuilder.module.scss';
import {useEffect} from "react";

const FormContainer = ({activeStep}) => {
  const router = useRouter();
  const {directorState, dispatch} = useDirectorContext();

  const SUPPORTED_STEPS = [
    'name',
    'details',
    'dates',
    'logo',
    'scoring',
    'required_events',
    'additional_events',
    'derived_events',
  ];

  useEffect(() => {
    if (!activeStep) {
      return;
    }
    if (!SUPPORTED_STEPS.includes(activeStep)) {
      router.push('/director/tournaments');
    }
  }, [activeStep]);

  return (
    <div className={classes.FormContainer}>
      {activeStep === 'name' && <Name/>}
      {activeStep === 'details' && <Details/>}
      {activeStep === 'dates' && <Dates/>}
      {activeStep === 'logo' && <Logo/>}
      {activeStep === 'scoring' && <Scoring/>}
      {activeStep === 'required_events' && <RequiredEvents/>}
      {activeStep === 'additional_events' && <AdditionalEvents/>}
      {activeStep === 'derived_events' && <DerivedEvents/>}
    </div>
  );
}

export default FormContainer;