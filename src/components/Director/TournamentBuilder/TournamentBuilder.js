import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentBuilder.module.scss';
import Progress from "./Progress";
import FormContainer from "./FormContainer";
import {useEffect, useState} from "react";
import {newTournamentInitiated} from "../../../store/actions/directorActions";
import {devConsoleLog} from "../../../utils";

const TournamentBuilder = ({step}) => {

  const {directorState, dispatch} = useDirectorContext();
  const [activeStep, setActiveStep] = useState();

  // Get the current step from context, unless we have a step param passed in
  useEffect(() => {
    if (!directorState.builder || !directorState.builder.currentStep) {
      return;
    }
    if (step) {
      setActiveStep(step);
    } else {
      setActiveStep(directorState.builder.currentStep);
    }
  }, [directorState.builder.currentStep, step]);

  if (!activeStep) {
    return '';
  }

  return (
    <div className={classes.TournamentBuilder}>
      <div className={'row'}>
        <div className={'col-12 col-sm-4'}>
          <Progress activeStep={activeStep}/>
        </div>
        <div className={'col-12 col-sm-8'}>
          <FormContainer activeStep={activeStep} />
        </div>
      </div>
    </div>
  );
}

export default TournamentBuilder;