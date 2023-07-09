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

const FormContainer = ({activeStep, substep}) => {
  if (!activeStep) {
    return '';
  }

  let shownStep = '';
  switch (activeStep) {
    case 'name':
      shownStep = <Name/>;
      break;
    case 'details':
      shownStep = <Details/>;
      break;
    case 'dates':
      shownStep = <Dates/>;
      break;
    case 'logo':
      shownStep = <Logo/>;
      break;
    case 'shifts':
      shownStep = <Shifts substep={substep}/>;
      break;
    // case 'scoring':
    //   shownStep = <Scoring/>;
    //   break;
    // case 'required_events':
    //   shownStep = <RequiredEvents/>;
    //   break;
    // case 'additional_events':
    //   shownStep = <AdditionalEvents/>;
    //   break;
    // case 'derived_events':
    //   shownStep = <DerivedEvents/>;
    //   break;
    default:
      shownStep = <Name/>;
      break;
  }

  return (
    <div className={classes.FormContainer}>
      {shownStep}
    </div>
  );
}

export default FormContainer;
