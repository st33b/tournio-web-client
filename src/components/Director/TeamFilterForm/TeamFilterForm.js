import {useState} from 'react';

import classes from './TeamFilterForm.module.scss';

import Form from 'react-bootstrap/Form';

const TeamFilterForm = (props) => {
  const initialState = {
    incomplete: false,
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
      default:
        console.log('uhh...');
        break;
    }

    setFilterForm(updatedForm);
    props.onFilterApplication(updatedForm);
  }

  const form = (
    <Form className={'p-3 col offset-2 offset-sm-3 offset-md-4'} >
      <Form.Check type={'switch'}
                  id={'incomplete'}
                  name={'incomplete'}
                  label={'Incomplete teams only'}
                  checked={filterForm.incomplete}
                  onChange={(event) => inputChangedHandler(event, 'incomplete')}
      />
    </Form>
  );

  return (
    <div className={classes.TeamFilterForm}>
      {form}
    </div>
  )
};

export default TeamFilterForm;