import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentBuilder.module.scss';
import Progress from "./Progress";
import FormContainer from "./FormContainer";

const TournamentBuilder = ({step}) => {
  const {directorState, dispatch} = useDirectorContext();
  const activeStep = typeof(step) === 'undefined' ? 'name' : step;

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