import Card from "react-bootstrap/Card";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './ProgressSummary.module.scss';

const progressSummary = (props) => {
  const context = useRegistrationContext();

  const tournament = context.tournament;
  if (!tournament) {
    return '';
  }

  let teamText = '';
  // should the team info come from props or context? hmm...

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
        Summary data goes here.

        {teamText}
        {bowlersText}
        {doublesLink}
        {nextStepButton}
      </Card.Body>
    </Card>
  );
};

export default progressSummary;