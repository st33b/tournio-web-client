import Button from 'react-bootstrap/Button';
import Placeholder from "react-bootstrap/Placeholder";

import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './VisibleTournament.module.scss';

/* Assumption: tournament.state is active */
const CloseTournament = ({tournament, closeTournament}) => {
  const stateChangeSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm("This step is irreversible. Are you sure?")) {
      closeTournament('close');
    }
  }

  let content = (
    <Placeholder.Button variant={'danger'} xs={6} />
  );

  if (tournament) {
    content = (
      <form onSubmit={stateChangeSubmitHandler}>
        <Button variant={'danger'}
                type={'submit'}>
          Close Registration
        </Button>
      </form>
    );
  }

  return (
    <div className={classes.StateChange}>
      <ErrorBoundary>
        {content}
      </ErrorBoundary>
    </div>
  );
}

export default CloseTournament;