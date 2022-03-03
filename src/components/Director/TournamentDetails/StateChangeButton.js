import Button from 'react-bootstrap/Button';

import classes from './TournamentDetails.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";

const stateChangeButton = ({stateChangeInitiated}) => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  let variant = '';
  let stateChangeText = '';
  let stateChangeValue = '';
  switch (context.tournament.state) {
    case 'setup':
      variant = 'warning';
      stateChangeText = 'Begin Testing';
      stateChangeValue = 'test';
      break;
    case 'testing':
      variant = 'success';
      stateChangeText = 'Open Registration';
      stateChangeValue = 'open';
      break;
    case 'active':
      variant = 'danger';
      stateChangeText = 'Close Registration';
      stateChangeValue = 'close';
      break;
  }

  const stateChangeSubmitHandler = (event) => {
    event.preventDefault();
    stateChangeInitiated(event.target.children.state_action.value);
  }

  let stateChangeButton = '';
  if (variant) {
    stateChangeButton = (
      <div className={classes.StateChange}>
        <form onSubmit={stateChangeSubmitHandler}>
          <input type={'hidden'} name={'state_action'} value={stateChangeValue} />
          <Button variant={variant} type={'submit'}>
            {stateChangeText}
          </Button>
        </form>
      </div>
    );
  }

  return stateChangeButton;
}

export default stateChangeButton;