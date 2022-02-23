import {Button, Card} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './Summary.module.scss';

const summary = ({nextStepClicked, nextStepText}) => {
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
                onClick={nextStepClicked}>
          {nextStepText}
        </Button>
      );
    }
  }

  // for editing doubles partners
  let doublesLink = '';


  return (
    <Card className={`${classes.Summary} border-0`}>
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
  );
};

export default summary;