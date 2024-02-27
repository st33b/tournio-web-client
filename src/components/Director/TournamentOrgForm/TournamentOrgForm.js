import classes from './TournamentOrgForm.module.scss';
import {useState} from "react";
import ErrorAlert from "../../common/ErrorAlert";

const TournamentOrgForm = ({existingOrg, onSubmit}) => {

  const initialState = {
    fields: {
      name,
    },
    valid: false,
    touched: false,
  }

  const [orgFormData, setOrgFormData] = useState(initialState);
  const [errorMsg, setErrorMsg] = useState(null);

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

  const resetForm = () => {
    setOrgFormData(initialState);
  }

  const submitClicked = (event) => {
    event.preventDefault();
    onSubmit(orgFormData.fields.name, resetForm);
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
            {errorMsg && <ErrorAlert message={errorMsg}
                                     className={`mt-3 mb-0`}
                                     onClose={() => setErrorMsg(null)}/> }
          </form>
        </div>
      </div>
    </div>
  );
}

export default TournamentOrgForm;
