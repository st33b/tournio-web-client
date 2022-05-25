import Button from 'react-bootstrap/Button';

import classes from './ActiveTournament.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";

/* Assumption: tournament.state is active */
const CloseTournament = ({tournament, closeTournament}) => {
  if (!tournament || !tournament.config_items) {
    return '';
  }

  const stateChangeSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm("This step is irreversible. Are you sure?")) {
      closeTournament('close');
    }
  }

  return (
      <ErrorBoundary>
        <div className={classes.StateChange}>
          <form onSubmit={stateChangeSubmitHandler}>
            <Button variant={'danger'}
                    type={'submit'}>
              Close Registration
            </Button>
          </form>
        </div>
      </ErrorBoundary>
    );
}

export default CloseTournament;