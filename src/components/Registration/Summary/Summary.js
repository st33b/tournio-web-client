import {Button, Card} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './Summary.module.scss';

const Summary = ({nextStepClicked, nextStepText, buttonDisabled, enableDoublesEdit}) => {
  const {entry} = useRegistrationContext();

  if (!entry.tournament) {
    return '';
  }

  let teamText = '';
  if (entry.teamName) {
    teamText = (
      <p>
        <span>
          Team name:{' '}
        </span>
        <span className={'fw-bold'}>
          {entry.teamName}
        </span>
      </p>
    );
  }

  // list the names of bowlers added so far
  let bowlersText = '';
  let nextStepButton = '';
  if (entry.bowlers && entry.bowlers.length > 0) {
    bowlersText = (
      <ol>
        {entry.bowlers.map((b, i) => {
          return (
            <li key={i}>
              {b.first_name} {b.last_name}
            </li>
          )
        })}
      </ol>
    );

    // e.g., finished with bowlers, submit registration
    // we only want to show this button if we have at least one bowler
    if (nextStepText) {
      nextStepButton = (
        <Button variant={'success'}
                size={'lg'}
                disabled={buttonDisabled}
                onClick={nextStepClicked}>
          {nextStepText}
        </Button>
      );
    }
  }

  // for editing doubles partners
  let doublesLink = '';
  if (enableDoublesEdit && entry.bowlers && entry.bowlers.length > 1) {
    doublesLink = (
      <div className='text-start pb-4'>
        <a
          href={`/tournaments/${entry.tournament.identifier}/doubles-partners`}
          className=''>
          Edit doubles partners
        </a>
      </div>
    );
  }

  return (
    <div className={classes.Summary}>
      <Card className={`border-0`}>
        <Card.Img variant={'top'}
                  src={entry.tournament.image_path}
                  className={'d-none d-sm-block'}/>
        <Card.Body>
          <Card.Title>
            {entry.tournament.name}
          </Card.Title>
          {teamText}
          {bowlersText}
          {doublesLink}
          {nextStepButton}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Summary;