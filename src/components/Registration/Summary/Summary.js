import {Button, Card, Col, Row, Image} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './Summary.module.scss';
import {useEffect, useState} from "react";
import {useClientReady} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";

const Summary = ({tournament, nextStepClicked, nextStepText, buttonDisabled, enableDoublesEdit, finalStep}) => {
  const {registration} = useRegistrationContext();

  const [team, setTeam] = useState();
  const [bowler, setBowler] = useState();
  const [bowlers, setBowlers] = useState();
  const [partner, setPartner] = useState();

  useEffect(() => {
    if (!registration) {
      return;
    }

    setTeam(registration.team);
    setBowler(registration.bowler);
    setBowlers(registration.bowlers);
    setPartner(registration.partner);
  }, [registration]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!tournament) {
    return '';
  }

  let teamText = '';
  if (team && team.name) {
    teamText = (
      <p>
        <span>
          Team name:{' '}
        </span>
        <span className={'fw-bold'}>
          {team.name}
        </span>
      </p>
    );
  }

  let shiftText = '';
  if (tournament.available_shifts.length > 1) {
    let shiftSource = team;
    if (!team && bowler) {
      shiftSource = bowler;
    }
    if (shiftSource.shift) {
      shiftText = (
        <p>
        <span>
          Preferred Shift:{' '}
        </span>
          <span className={'fw-bold'}>
          {shiftSource.shift.name}
        </span>
        </p>
      );
    }
  }
  // TODO: adapt for pair (if we need to)

  // list the names of bowlers added to the team so far
  let bowlersText = '';
  if (team && team.bowlers.length > 0) {
    bowlersText = (
      <ol>
        {team.bowlers.map((b, i) => {
          return (
            <li key={i}>
              {b.first_name} {b.last_name}
            </li>
          )
        })}
      </ol>
    );
  }
  if (bowlers && bowlers.length > 0) {
    bowlersText = (
      <ol>
        {bowlers.map((b, i) => {
          return (
            <li key={i}>
              {b.first_name} {b.last_name}
            </li>
          )
        })}
      </ol>
    );
  }

  let partnerText = '';
  if (partner) {
    partnerText = (
      <p>
        <span>
          Partner:{' '}
        </span>
        <span className={'fw-bold'}>
          {partner.full_name}
        </span>
      </p>
    );
  }

  // for editing doubles partners
  let doublesLink = '';
  if (enableDoublesEdit && team && team.bowlers && team.bowlers.length > 2) {
    doublesLink = (
      <div className='text-start pb-4'>
        <a
          href={`/tournaments/${tournament.identifier}/doubles-partners`}
          className=''>
          Edit doubles partners
        </a>
      </div>
    );
  }

  // e.g., finished with bowlers, submit registration
  // we only want to show this button if we have at least one bowler
  let nextStep = '';
  if (nextStepText && (team && team.bowlers.length > 0 || !!bowler || !!bowlers && bowlers.length > 0)) {
    nextStep = (
      <div className={'text-end text-sm-center'}>
        <Button variant={'success'}
                size={'lg'}
                disabled={buttonDisabled}
                onClick={nextStepClicked}>
          {nextStepText}
        </Button>
      </div>
    );
  }

  if (finalStep && team) {
    const teamSize = team.bowlers.length;
    const maxTeamSize = tournament.team_size;
    if (teamSize < maxTeamSize) {
      nextStep = (
        <form onSubmit={nextStepClicked}>
          <div className={'form-check mb-3'}>
            <input type={'checkbox'}
                   className={'form-check-input'}
                   name={'placeWithOthers'}
                   id={'placeWithOthers'}
            />
            <label className={'form-check-label'}
                   htmlFor={'placeWithOthers'}
            >
              We&apos;d like the tournament committee to fill our team by placing other bowlers with us.
            </label>
          </div>

          <Button variant={'success'}
                  size={'lg'}
                  type={'submit'}
                  disabled={buttonDisabled}>
            {nextStepText}
          </Button>
        </form>
      );
    }
  }

  return (
    <ErrorBoundary>
      <div className={classes.Summary}>
        <Card className={`border-0`}>
          <Card.Img variant={'top'}
                    src={tournament.image_url}
                    className={'d-none d-sm-block'}/>
          <Card.Body className={'d-sm-none px-0 py-0'}>
            <Row className={'mb-3'}>
              <Col xs={3}>
                <Image fluid
                       src={tournament.image_url}
                       alt={"tournament logo"}
                />
              </Col>
              <Col>
                <Card.Title>
                  {tournament.name}
                </Card.Title>
                {teamText}
                {bowlersText}
                {partnerText}
                {doublesLink}
                {nextStep}
              </Col>
            </Row>
          </Card.Body>
          <Card.Body className={'d-none d-sm-block px-3 pt-0'}>
            <Card.Title className={'my-3 text-center'}>
              {tournament.name}
            </Card.Title>
            {teamText}
            {shiftText}
            {bowlersText}
            {partnerText}
            {doublesLink}
            {nextStep}
          </Card.Body>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default Summary;
