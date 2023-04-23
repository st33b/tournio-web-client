import React, {useEffect, useState} from "react";
import {Form, Row, Col, Button} from "react-bootstrap";
import {Map} from "immutable";

import classes from './TeamForm.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import {useClientReady} from "../../../utils";
import ShiftForm from "../ShiftForm/ShiftForm";

const TeamForm = ({tournament, teamFormCompleted}) => {
  const initialFormState = {
    teamName: '',
    shift: '',
    valid: false,
  }
  const [teamForm, setTeamForm] = useState(Map(initialFormState));

  useEffect(() => {
    if (!tournament) {
      return;
    }
    if (tournament.available_shifts.length === 1) {
      const newTeamForm = teamForm.set('shift', tournament.available_shifts[0].identifier);
      setTeamForm(newTeamForm);
    }
  }, [tournament]);

  const formHandler = (event) => {
    event.preventDefault();

    if (!teamForm.get('valid')) {
      return;
    }

    teamFormCompleted(teamForm.get('teamName'), teamForm.get('shift'));
  }

  const isValid = (formData) => {
    return formData.get('teamName').trim().length > 0;
  }

  const inputChangedHandler = (event) => {
    const inputName = event.target.name;
    const newValue = event.target.value;

    const changedForm = teamForm.set(inputName, newValue);
    setTeamForm(changedForm.set('valid', isValid(changedForm)));
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!tournament) {
    return '';
  }

  return (
    <ErrorBoundary>
      <div className={classes.TeamForm}>
        <Form onSubmit={formHandler} noValidate>
          <Form.Group as={Row}
                      className={'mb-3'}
                      controlId={'teamName'}>
            <Form.Label column={'lg'}
                        className={classes.Label}
                        md={4}>
              Team Name
            </Form.Label>
            <Col md={8}>
              <Form.Control type={'text'}
                            placeholder={'Name your team!'}
                            maxLength={100}
                            size={'lg'}
                            name={'teamName'}
                            required
                            onChange={inputChangedHandler}
                            value={teamForm.get('teamName')}/>
              <Form.Control.Feedback type={'invalid'}>
                Every team needs a good name!
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <ShiftForm tournament={tournament}
                     onInputChanged={inputChangedHandler}
                     currentSelection={teamForm.get('shift')} />

          <Row>
            <Col className={classes.Submit}>
              <Button type={'submit'}
                      variant={'success'}
                      size={'lg'}
                      disabled={!teamForm.get('valid')}>
                Next: Bowler Details
                <i className={'bi-chevron-right'} aria-hidden={true}/>
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </ErrorBoundary>
  )
};

export default TeamForm;
