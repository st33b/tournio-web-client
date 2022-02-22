import Card from "react-bootstrap/Card";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './Summary.module.scss';

const summary = (props) => {
  const context = useRegistrationContext();

  const tournament = context.tournament;
  if (!tournament) {
    return '';
  }

  let teamText = '';
  if (context.state.teamName) {
    teamText = (
      <p>
        <span>
          Team name:{' '}
        </span>
        <span className={'fw-bold'}>
          {context.state.teamName}
        </span>
      </p>
    );
  }

  // list the names of bowlers added so far
  let bowlersText = '';

  // e.g., finished with bowlers, submit registration
  let nextStepButton = '';

  // for editing doubles partners
  let doublesLink = '';

  return (
    <Card className={'border-0'}>
      <Card.Img variant={'top'}
                src={tournament.image_path}
                className={'d-none d-sm-block'}/>
      <Card.Body>
        <Card.Title>
          {tournament.name}
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