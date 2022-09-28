import {useState} from "react";
import FormData from "form-data";

import {useDirectorContext} from "../../../../store/DirectorContext";
import {directorApiRequest} from "../../../../director";
import {devConsoleLog} from "../../../../utils";
import LogoImage from "../../LogoImage/LogoImage";

import classes from '../TournamentBuilder.module.scss';
import {newTournamentSaved, newTournamentStepCompleted} from "../../../../store/actions/directorActions";

const Logo = () => {
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const initialState = {
    fields: {
      file: '',
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialState);

  const isValid = (fields) => {
    return fields.file && fields.file.size > 0;
  }

  const inputChanged = (event) => {
    const changedData = {...formData};
    changedData.fields.file = event.target.files[0];
    changedData.valid = isValid(changedData.fields);
    setFormData(changedData);
  }

  const onSuccess = (data) => {
    const tournament = {...directorState.builder.tournament};
    tournament.image_url = data.image_url;
    dispatch(newTournamentSaved(tournament));
  }

  const uploadTheFile = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('file', formData.fields.file);

    const uri = `/director/tournaments/${directorState.builder.tournament.identifier}/logo_upload`;
    const requestConfig = {
      method: 'post',
      data: form,
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: onSuccess,
      onFailure: (_) => setError('File failed to upload'),
    });
  }

  const nextClicked = () => {
    dispatch(newTournamentStepCompleted('logo', 'scoring'));
  }

  return (
    <div>
      <h2>New Tournament: Logo</h2>

      {/* Show the existing image if there is one. */}
      <LogoImage src={directorState.builder.tournament.image_url}/>

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
                  onClick={nextClicked}>
            Next
            <i className={'bi-arrow-right ps-2'} aria-hidden={true}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logo;