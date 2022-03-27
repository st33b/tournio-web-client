import Button from 'react-bootstrap/Button';

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentDetails.module.scss';

const StateChangeButton = ({stateChangeInitiated}) => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  const disabled = context.tournament.state === 'setup' && !context.tournament.purchasable_items.some(item => item.determination === 'entry_fee')

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
    if (confirm("This step is irreversible. Are you sure?")) {
      stateChangeInitiated(event.target.children.state_action.value);
    }
  }

  let stateChangeButton = '';
  if (variant) {
    stateChangeButton = (
      <div className={classes.StateChange}>
        <form onSubmit={stateChangeSubmitHandler}>
          <input type={'hidden'} name={'state_action'} value={stateChangeValue} />
          <Button variant={variant}
                  disabled={disabled}
                  title={disabled ? 'Requires an entry fee first' : ''}
                  type={'submit'}>
            {stateChangeText}
          </Button>
        </form>
      </div>
    );
  }

  return stateChangeButton;
}

export default StateChangeButton;