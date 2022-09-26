import {useDirectorContext} from "../../../store/DirectorContext";
import Name from './FormSteps/Name';
import Details from "./FormSteps/Details";
import Dates from './FormSteps/Dates';
import Logo from "./FormSteps/Logo";

import classes from './TournamentBuilder.module.scss';
import Scoring from "./FormSteps/Scoring";
import RequiredEvents from "./FormSteps/RequiredEvents";
import AdditionalEvents from "./FormSteps/AdditionalEvents";
import DerivedEvents from "./FormSteps/DerivedEvents";

const FormContainer = ({activeStep}) => {
  const {directorState, dispatch} = useDirectorContext();

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