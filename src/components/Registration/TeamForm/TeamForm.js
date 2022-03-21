import {useState} from "react";
import {Form, Row, Col, Button} from "react-bootstrap";

import {updateObject} from "../../../utils";

import classes from './TeamForm.module.scss';

const TeamForm = ({teamFormCompleted}) => {
  const initialFormState = {
    teamName: '',
    valid: false,
  }
  const [teamForm, setTeamForm] = useState(initialFormState);

  const formHandler = (event) => {
    event.preventDefault();

    if (!teamForm.valid) {
      return;
    }

    teamFormCompleted(teamForm.teamName);
  }

  const isValid = (value) => {
    return value.trim().length > 0;
  }

  const inputChangedHandler = (event) => {
    const enteredName = event.target.value;
    const newState = updateObject(teamForm, {
      teamName: enteredName,
      valid: isValid(enteredName),
    });
    setTeamForm(newState);
  }

  return (
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
                          required
                          onChange={(event) => inputChangedHandler(event)}
                          value={teamForm.teamName} />
            <Form.Control.Feedback type={'invalid'}>
              Every team needs a good name!
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Row>
          <Col className={classes.Submit}>
            <Button type={'submit'}
                    variant={'success'}
                    size={'lg'}
                    disabled={!teamForm.valid}>
              Next: Bowler Details
              <i className={'bi-chevron-right'} aria-hidden={true} />
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
};

export default TeamForm;