import classes from './AssetUpload.module.scss';
import {useState} from "react";

const AssetUpload = ({formLabel, uploadPath, onUploadComplete}) => {
  const initialState = {
    localFile: null,
  }

  const [formData, setFormData] = useState(initialState);

  const inputChanged = (event) => {
    const inputName = event.target.name;
    const newData = {...formData};
    newData[inputName] = event.target.files[0];
    setFormData(newData);
  }

  const uploadThatFile = () => {

  }

  return (
    <div className={classes.AssetUpload}>
      <div className={'row'}>
        <label htmlFor={'localFile'}
               className={`form-label`}>
          {formLabel}
        </label>
        <input className={`form-control form-control-sm`}
               type="file"
               name={'localFile'}
               id={'localFile'}
               onChange={inputChanged}
        />
      </div>

      <div className={`d-flex justify-content-center ${classes.Button}`}>
        <button type={"button"}
                className={"btn btn-sm btn-primary"}
                onClick={uploadThatFile}
                disabled={formData.localFile === null}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default AssetUpload;
