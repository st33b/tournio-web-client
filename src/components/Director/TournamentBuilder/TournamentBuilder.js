import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentBuilder.module.scss';
import Progress from "./Progress";
import FormContainer from "./FormContainer";
import {useEffect, useState} from "react";
import ErrorBoundary from "../../common/ErrorBoundary";

const TournamentBuilder = ({step, substep}) => {
  const {state} = useDirectorContext();
  const [activeStep, setActiveStep] = useState();

  // Get the current step from context, unless we have a step param passed in
  useEffect(() => {
    if (!state.builder || !state.builder.currentStep) {
      return;
    }
    if (step) {
      setActiveStep(step);
    } else {
      setActiveStep(state.builder.currentStep);
    }
  }, [state.builder, step]);

  if (!activeStep) {
    return '';
  }

  return (
    <div className={classes.TournamentBuilder}>
      <div className={'row'}>
        <div className={'col-12 col-sm-4'}>
          <Progress activeStep={activeStep}/>
        </div>
        <ErrorBoundary>
          <div className={'col-12 col-sm-8'}>
            <FormContainer activeStep={activeStep} substep={substep}/>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default TournamentBuilder;
