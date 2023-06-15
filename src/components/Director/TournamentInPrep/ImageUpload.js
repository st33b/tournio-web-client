import classes from './ImageUpload.module.scss';

import {useState} from "react";
import Card from 'react-bootstrap/Card';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import FormData from 'form-data';
import LogoImage from "../LogoImage/LogoImage";
import {logoImageUploaded} from "../../../store/actions/directorActions";
import {useLoginContext} from "../../../store/LoginContext";

const ImageUpload = ({tournament}) => {
  const {authToken} = useLoginContext();
  const {dispatch} = useDirectorContext();

  const [formDisplayed, setFormDisplayed] = useState(false);
  const [fileInput, setFileInput] = useState({
    file: '',
  });
  const [success, setSuccess] = useState();
  const [error, setError] = useState();

  if (!tournament) {
    return '';
  }

  const whereTheFileIsChanged = (event) => {
    const newValue = {...fileInput};
    newValue.file = event.target.files[0];
    setFileInput(newValue);
  }

  const onSuccess = (data) => {
    const imageUrl = data.image_url;
    dispatch(logoImageUploaded(imageUrl));
    setSuccess('File successfully uploaded.');
    setFormDisplayed(false);
  }

  const uploadTheFile = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', fileInput.file);

    const uri = `/director/tournaments/${tournament.identifier}/logo_upload`;
    const requestConfig = {
      method: 'post',
      data: formData,
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: onSuccess,
      onFailure: (_) => setError('File failed to upload'),
    });
  }

  return (
    <Card className={`text-center mb-3 ${classes.ImageUpload}`}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Logo
      </Card.Header>
      <Card.Body className={formDisplayed ? classes.CurrentImage : ''}>
        <LogoImage src={tournament.image_url}/>
      </Card.Body>
        {!formDisplayed && (
          <Button variant={'outline-primary'}
                  type={'button'}
                  size={'sm'}
                  className={'mb-3 mx-auto'}
                  onClick={() => setFormDisplayed(true)}
          >
            Upload new file
          </Button>
        )}
        {formDisplayed && (
          <div className={classes.UploadForm}>
            <Form.Group controlId="imageFile" className="pb-3">
              <Form.Label>Logo File Upload</Form.Label>
              <Form.Control type="file"
                            size="sm"
                            className={'mb-2'}
                            onChange={whereTheFileIsChanged}
              />
              <Form.Text id="passwordHelpBlock" muted className={`mt-0`}>
                A square-ish image works best.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId={'uploadGo'} className={`d-flex justify-content-end`}>
              <Button variant={'secondary'}
                      className={'me-3'}
                      type={'button'}
                      onClick={() => setFormDisplayed(false)}>
                Cancel
              </Button>
              <Button variant={'primary'}
                      type={'button'}
                      onClick={uploadTheFile}>
                Upload
              </Button>
            </Form.Group>
          </div>
        )}
        {success && (
          <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center my-2'}
               role={'alert'}>
            <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
            <div className={'me-auto'}>
              {success}
              <button type="button"
                      className={"btn-close"}
                      data-bs-dismiss="alert"
                      onClick={() => setSuccess(null)}
                      aria-label="Close"/>
            </div>
          </div>
        )}
        {error && (
          <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center my-2'}
               role={'alert'}>
            <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
            <div className={'me-auto'}>
              {error}
              <button type="button"
                      className={"btn-close"}
                      data-bs-dismiss="alert"
                      onClick={() => setError(null)}
                      aria-label="Close"/>
            </div>
          </div>
        )}
    </Card>
  );
}

export default ImageUpload;
