import Button from 'react-bootstrap/Button';

import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './VisibleTournament.module.scss';

/* Assumption: tournament.state is active */
const CloseTournament = ({closeTournament}) => {
  const stateChangeSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm("This step is irreversible. Are you sure?")) {
      closeTournament('close');
    }
  }

  return (
    <div className={classes.StateChange}>
      <ErrorBoundary>
        <form onSubmit={stateChangeSubmitHandler}>
          <Button variant={'danger'}
                  type={'submit'}>
            Close Registration
          </Button>
        </form>
      </ErrorBoundary>
    </div>
  );
}

export default CloseTournament;
