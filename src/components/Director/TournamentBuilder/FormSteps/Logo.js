import {useState} from "react";
import FormData from "form-data";

import {useDirectorContext} from "../../../../store/DirectorContext";
import {directorApiRequest} from "../../../../director";
import {devConsoleLog} from "../../../../utils";
import LogoImage from "../../LogoImage/LogoImage";

import classes from '../TournamentBuilder.module.scss';

const Logo = () => {
  const {directorState, dispatch} = useDirectorContext();

  const initialState = {
    fields: {
      file: '',
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);

  const isValid = (fields) => {
    return fields.file.length > 0;
  }

  const inputChanged = (event) => {
    const changedData = {...formData};
    const newValue = event.target.value;
    const fieldName = event.target.name;
    changedData.fields[fieldName] = newValue;
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const uploadTheFile = (e) => {
    e.preventDefault();

    devConsoleLog("Here is where we upload the file");
    // const formData = new FormData();
    // formData.append('file', imageFile.files[0]);

    // const uri = `/director/tournaments/${tournament.identifier}/logo_upload`;
    // const requestConfig = {
    //   method: 'post',
    //   data: formData,
    // };
    // directorApiRequest({
    //   uri: uri,
    //   requestConfig: requestConfig,
    //   context: context,
    //   onSuccess: onSuccess,
    //   onFailure: (_) => setError('File failed to upload'),
    // });
  }

  return (
    <div>
      <h2>New Tournament: Logo</h2>

      {/* Show the existing image if there is one. */}
      {/*<LogoImage src={tournament.image_url}/>*/}

      <div className={`row ${classes.FieldRow}`}>
        <label htmlFor={'file'}
               className={'col-12 col-md-3 col-form-label'}>
          Logo Image
        </label>
        <div className={'col'}>
          <input type={'file'}
                 name={'file'}
                 id={'file'}
                 className={'form-control'}
                 value={formData.fields.name}
                 onChange={inputChanged}/>
          <div id={"imageHelpText"}
               className={'form-text'}>
            A square-ish image works best.
          </div>
          <button className={`btn btn-outline-primary ${classes.FieldButton}`}
                  type={'button'}
                  onClick={uploadTheFile}>
            Upload
          </button>
        </div>
      </div>

      <div className={`row ${classes.ButtonRow}`}>
        <div className={'col-12 d-flex justify-content-between'}>
          <button className={'btn btn-outline-secondary'}
                  role={'button'}
                  onClick={() => {}}>
            <i className={'bi-arrow-left pe-2'} aria-hidden={true}/>
            Previous
          </button>
          <button className={'btn btn-outline-primary'}
                  role={'button'}
                  onClick={() => {}}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logo;