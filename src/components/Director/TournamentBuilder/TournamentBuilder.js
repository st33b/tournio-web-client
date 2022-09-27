import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentBuilder.module.scss';
import Progress from "./Progress";
import FormContainer from "./FormContainer";
import {useEffect, useState} from "react";
import {newTournamentInitiated} from "../../../store/actions/directorActions";

const TournamentBuilder = ({step}) => {
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

  const {directorState, dispatch} = useDirectorContext();
  const [activeStep, setActiveStep] = useState();

  // Get the current step from context, unless we have a step param passed in
  // Pick up here.
  useEffect(() => {
    if (!directorState || !step) {
      return;
    }
    if (!SUPPORTED_STEPS.includes(step)) {
      setActiveStep('name');
    } else {
      setActiveStep(step);
    }
  }, [directorState, step]);

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