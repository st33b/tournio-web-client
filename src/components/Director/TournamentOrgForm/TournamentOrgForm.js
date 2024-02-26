import classes from './TournamentOrgForm.module.scss';
import {useState} from "react";

const TournamentOrgForm = ({existingOrg, onSubmit}) => {

  const initialState = {
    fields: {
      name,
    },
    valid: false,
    touched: false,
  }

  const [orgFormData, setOrgFormData] = useState(initialState);

  // Placeholder: populating form with edit data

  const nameChanged = (e) => {
    const updatedFormData = {
      fields: { ...orgFormData.fields },
      valid: false,
      touched: true,
    };

    const newName = e.target.value;
    updatedFormData.valid = newName.length > 0;
    updatedFormData.fields.name = newName;
    setOrgFormData(updatedFormData);
  }

  const submitClicked = (event) => {
    event.preventDefault();
    onSubmit(orgFormData.fields.name);
  }

  return (
    <div className={classes.TournamentOrgForm}>
      <div className={`card`}>
        <h5 className={`card-header`}>
          New Tournament Org
        </h5>
        <div className={`card-body`}>
          <form noValidate={true} onSubmit={submitClicked}>
            <div className={``}>
              <label htmlFor={'name'} className={`form-label`}>
                Name
              </label>
              <input type={'text'}
                     className={`form-control`}
                     id={`name`}
                     name={`name`}
                     onChange={nameChanged}
                     value={orgFormData.fields.name}/>
            </div>
            <div className={classes.Actions}>
              <input type={'submit'}
                     className={`btn btn-primary`}
                     disabled={!orgFormData.valid}
                     value={'Create'}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TournamentOrgForm;
