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
  let demoButton = '';
  switch (context.tournament.state) {
    case 'setup':
      disabled = !context.tournament.purchasable_items.some(item => item.determination === 'entry_fee');
      if (disabled) {
        titleText = 'An entry fee must be set before testing can begin.';
      }
      variant = 'warning';
      stateChangeText = 'Begin Testing';
      stateChangeValue = 'test';

      if (context.user.role === 'superuser') {
        demoButton = (
          <button className={'btn btn-outline-warning'}
                  type={'button'}
                  onClick={() => demoStateChangeHandler('demonstrate')}
                  role={'button'}>
            Enable Demo
          </button>
        );
      }
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
    case 'demo':
      if (context.user.role === 'superuser') {
        demoButton = (
          <button className={'btn btn-outline-danger'}
                  type={'button'}
                  role={'button'}
                  onClick={() => demoStateChangeHandler('reset')}>
            Reset Demo
          </button>
        )
      }
      break;
  }

  const stateChangeSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm("This step is irreversible. Are you sure?")) {
      stateChangeInitiated(event.target.children.state_action.value);
    }
  }

  const demoStateChangeHandler = (newState) => {
    if (confirm("This can't be undone. Are you sure?")) {
      stateChangeInitiated(newState);
    }
  }

  let stateChangeButton = '';
  if (variant || demoButton) {
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
          {titleText && <div className={`${classes.WhyDisabledText} text-muted pt-3`}>({titleText})</div> }
        </form>
        {demoButton && (
          <div className={'d-flex justify-content-center pt-3'}>
            {demoButton}
          </div>
        )}
      </div>
    );
  }

  return stateChangeButton;
}

export default StateChangeButton;