import {useDirectorContext} from "../../../store/DirectorContext";
import Name from './FormSteps/Name';

import classes from './TournamentBuilder.module.scss';
import Details from "./FormSteps/Details";

const FormContainer = ({activeStep}) => {
  const {directorState, dispatch} = useDirectorContext();

  return (
    <div className={classes.FormContainer}>
      {activeStep === 'name' && <Name/>}
      {activeStep === 'details' && <Details/>}
    </div>
  );
}

export default FormContainer;