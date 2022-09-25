import {useDirectorContext} from "../../../store/DirectorContext";
import Name from './FormSteps/Name';
import Details from "./FormSteps/Details";
import Dates from './FormSteps/Dates';

import classes from './TournamentBuilder.module.scss';

const FormContainer = ({activeStep}) => {
  const {directorState, dispatch} = useDirectorContext();

  return (
    <div className={classes.FormContainer}>
      {activeStep === 'name' && <Name/>}
      {activeStep === 'details' && <Details/>}
      {activeStep === 'dates' && <Dates/>}
    </div>
  );
}

export default FormContainer;