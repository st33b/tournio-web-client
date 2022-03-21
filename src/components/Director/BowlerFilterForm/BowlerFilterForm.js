import {useState} from 'react';

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import {Col, FloatingLabel, Row} from "react-bootstrap";

import classes from './BowlerFilterForm.module.scss';

const BowlerFilterForm = ({onFilterApplication}) => {
  const initialState = {
    name: '',
    amount_due: false,
    has_free_entry: false,
  }

  const [filterForm, setFilterForm] = useState(initialState);

  const formHandler = (event) => {
    event.preventDefault();

    const formData = {...filterForm};

    onFilterApplication(formData);
  }

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = { ...filterForm };

    switch (inputIdentifier) {
      case 'amount_due':
      case 'has_free_entry':
        const oldValue = filterForm[inputIdentifier];
        const newValue = !oldValue;
        updatedForm[inputIdentifier] = newValue;
        break;
      case 'name':
        updatedForm[inputIdentifier] = event.target.value;
        break;
      default:
        console.log('uhh...');
        break;
    }

    setFilterForm(updatedForm);
  }

  const resetFilterHandler = () => {
    setFilterForm(initialState);
    onFilterApplication(initialState);
  }

  const form = (
    <Form onSubmit={formHandler} className={'p-3 bg-light col-md-10 offset-md-1 col-lg-8 offset-lg-2'} >
      <FloatingLabel label={'Name'}
                     controlId={'name_xs'}
                     className={'d-sm-none'}>
        <Form.Control type={'text'}
                      placeholder={'Name'}
                      value={filterForm.name}
                      onChange={(event) => inputChangedHandler(event, 'name')}
        />
      </FloatingLabel>
      <Form.Group controlId={'name'}
                  as={Row}
                  className={'mb-3'}>
        <Form.Label column sm={3} className={'d-none d-sm-block text-end'}>
          Name
        </Form.Label>
        <Col sm={9} className={'d-none d-sm-block'}>
          <Form.Control type={'text'}
                        placeholder={'Name'}
                        value={filterForm.name}
                        onChange={(event) => inputChangedHandler(event, 'name')}
          />
        </Col>
      </Form.Group>
      <Form.Group controlId={'amount_due'}
                  as={Row}
                  className={'mb-3'}>
        <Col sm={{span: 9, offset: 3}}>
          <Form.Check type={'checkbox'}
                      label={'Not paid in full'}
                      checked={filterForm.amount_due}
                      onChange={(event) => inputChangedHandler(event, 'amount_due')}
          />
        </Col>
      </Form.Group>
      <Form.Group controlId={'has_free_entry'}
                  as={Row}
                  className={'mb-3'}>
        <Col sm={{span: 9, offset: 3}}>
          <Form.Check type={'checkbox'}
                      label={'Has a free entry'}
                      checked={filterForm.has_free_entry}
                      onChange={(event) => inputChangedHandler(event, 'has_free_entry')}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Col sm={{span: 9, offset: 3}} className={'d-flex'}>
          <Button variant={'secondary'} type={'submit'}>
            Apply Filters
          </Button>
          <Button variant={'outline-secondary'}
                  type={'button'}
                  className={'ms-auto'}
                  onClick={resetFilterHandler}
          >
            Reset Filters
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );

  return (
    <div className={classes.BowlerFilterForm}>
      {form}
    </div>
  )
};

export default BowlerFilterForm;