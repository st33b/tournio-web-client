import {useState} from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import classes from './TeamFilterForm.module.scss';
import {Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const TeamFilterForm = (props) => {
  const initialState = {
    incomplete: false,
    shift_confirmed: '',
  }

  const [filterForm, setFilterForm] = useState(initialState);

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = { ...filterForm };

    switch (inputIdentifier) {
      case 'incomplete':
        const oldValue = filterForm[inputIdentifier];
        const newValue = !oldValue;
        updatedForm[inputIdentifier] = newValue;
        break;
      case 'shift_confirmed':
        updatedForm['shift_confirmed'] = event.target.value === 'true';
        break;
      default:
        console.log('uhh...');
        break;
    }

    setFilterForm(updatedForm);
  }

  const resetFilterHandler = () => {
    setFilterForm(initialState);
    // props.onFilterApplication(initialState);
    props.onFilterReset();
  }

  const formHandler = (event) => {
    event.preventDefault();
    props.onFilterApplication(filterForm);
  }

  const form = (
    <Form className={'p-3 col-md-10 offset-md-1 col-lg-8 offset-lg-2'} onSubmit={formHandler}>
      <Row>
        <Col sm={6}>
          <Form.Check type={'switch'}
                      id={'incomplete'}
                      name={'incomplete'}
                      label={'Incomplete teams only'}
                      checked={filterForm.incomplete}
                      onChange={(event) => inputChangedHandler(event, 'incomplete')}
          />
        </Col>
        {props.includeConfirmed && (
          <Col sm={6}>
            <Form.Group className={'mb-3'}>
              <Form.Label>
                Place Confirmation
              </Form.Label>
              <Form.Check type={'radio'}
                          value={true}
                          label={'Confirmed'}
                          name={'shift_confirmed'}
                          id={'confirmation_true'}
                          checked={filterForm.shift_confirmed === true}
                          onChange={(event) => inputChangedHandler(event, 'shift_confirmed')}
              />
              <Form.Check type={'radio'}
                          value={false}
                          label={'Not Confirmed'}
                          name={'shift_confirmed'}
                          id={'confirmation_false'}
                          checked={filterForm.shift_confirmed === false}
                          onChange={(event) => inputChangedHandler(event, 'shift_confirmed')}
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      <Form.Group as={Row}>
        <Col sm={{span: 9, offset: 3}} className={'d-flex'}>
          <Button variant={'dark'}
                  type={'submit'}
                  className={'me-2'}>
            Apply Filters
          </Button>
          <Button variant={'outline-dark'}
                  type={'button'}
                  className={'me-auto'}
                  onClick={resetFilterHandler}>
            Reset Filters
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );

  return (
    <div className={classes.TeamFilterForm}>
      {form}
    </div>
  )
};

export default TeamFilterForm;