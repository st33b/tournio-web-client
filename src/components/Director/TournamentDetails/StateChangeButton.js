import Button from 'react-bootstrap/Button';

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentDetails.module.scss';

const StateChangeButton = ({stateChangeInitiated}) => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  let variant = '';
  let stateChangeText = '';
  let stateChangeValue = '';
  let titleText = '';
  let disabled = false;
  switch (context.tournament.state) {
    case 'setup':
      disabled = !context.tournament.purchasable_items.some(item => item.determination === 'entry_fee');
      if (disabled) {
        titleText = 'Requires an entry fee first';
      }
      variant = 'warning';
      stateChangeText = 'Begin Testing';
      stateChangeValue = 'test';
      break;
    case 'testing':
      disabled = process.env.NODE_ENV === 'production' && context.tournament.config_items.find(item => item.key === 'paypal_client_id').value === 'sb';
      if (disabled) {
        titleText = 'PayPal Client ID must be set before opening registration';
      }
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
                  title={titleText}
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