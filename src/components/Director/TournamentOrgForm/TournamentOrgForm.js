import classes from './TournamentOrgForm.module.scss';
import {useEffect, useState} from "react";
import ErrorAlert from "../../common/ErrorAlert";

const TournamentOrgForm = ({existingOrg, onSubmit}) => {

  const initialState = {
    fields: {
      name: '',
      identifier: '',
    },
    valid: false,
    touched: false,
  }

  const [orgFormData, setOrgFormData] = useState(initialState);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!existingOrg) {
      return;
    }
    const values = {
      name: existingOrg.name,
      identifier: existingOrg.identifier,
    }
    setOrgFormData({
      fields: values,
      valid: true,
      touched: false,
    })
  }, [existingOrg]);

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

  const identifierChanged = (e) => {
    const updatedFormData = {
      fields: { ...orgFormData.fields },
      valid: false,
      touched: true,
    };

    const newIdentifier = e.target.value;

    const regex = /\s/; // just any kind of whitespace
    const matches = newIdentifier.match(regex);

    updatedFormData.valid = newIdentifier.length > 0 && !!matches;
    updatedFormData.fields.identifier = newIdentifier;
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

            {/*<div className={``}>*/}
            {/*  <label htmlFor={'name'} className={`form-label`}>*/}
            {/*    Identifier*/}
            {/*  </label>*/}
            {/*  <input type={'text'}*/}
            {/*         className={`form-control`}*/}
            {/*         id={`identifier`}*/}
            {/*         name={`identifier`}*/}
            {/*         onChange={identifierChanged}*/}
            {/*         value={orgFormData.fields.identifier}/>*/}
            {/*</div>*/}

            <div className={classes.Actions}>
              <input type={'submit'}
                     className={`btn btn-primary`}
                     disabled={!orgFormData.valid || !orgFormData.touched}
                     value={'Create'}/>
            </div>
            {errorMsg && <ErrorAlert message={errorMsg}
                                     className={`mt-3 mb-0`}
                                     onClose={() => setErrorMsg(null)}/>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default TournamentOrgForm;
