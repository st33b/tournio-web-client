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

const ImageUpload = ({tournament}) => {
  const context = useDirectorContext();
  const dispatch = context.dispatch;

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
    newValue.file = event.target.value;
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
    formData.append('file', imageFile.files[0]);

    const uri = `/director/tournaments/${tournament.identifier}/logo_upload`;
    const requestConfig = {
      method: 'post',
      data: formData,
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: onSuccess,
      onFailure: (_) => setError('File failed to upload'),
    });
  }

  return (
    <Card className={'text-center mb-3'}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Logo
      </Card.Header>
      <Card.Body>
        <LogoImage src={tournament.image_url}/>
        {!formDisplayed && (
          <Button variant={'outline-primary'}
                  type={'button'}
                  size={'sm'}
                  className={'mt-3'}
                  onClick={() => setFormDisplayed(true)}
          >
            Upload new file
          </Button>
        )}
        {formDisplayed && (
          <>
            <Form.Group controlId="imageFile" className="mb-3">
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
            <Form.Group controlId={'uploadGo'}>
              <Button variant={'outline-danger'}
                      className={'me-3'}
                      type={'button'}
                      onClick={() => setFormDisplayed(false)}>
                Cancel
              </Button>
              <Button variant={'outline-primary'}
                      type={'button'}
                      onClick={uploadTheFile}>
                Upload
              </Button>
            </Form.Group>
          </>
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
      </Card.Body>
    </Card>
  );
}

export default ImageUpload;