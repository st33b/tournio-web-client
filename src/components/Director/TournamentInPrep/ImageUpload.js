import classes from './ImageUpload.module.scss';

import React, {useState} from "react";
import Card from 'react-bootstrap/Card';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest, useTournament} from "../../../director";
import FormData from 'form-data';
import LogoImage from "../LogoImage/LogoImage";
import {logoImageUploaded} from "../../../store/actions/directorActions";
import {useLoginContext} from "../../../store/LoginContext";
import SuccessAlert from "../../common/SuccessAlert";
import ErrorAlert from "../../common/ErrorAlert";

const ImageUpload = ({tournamentIdentifier}) => {
  const {authToken} = useLoginContext();
  const {dispatch} = useDirectorContext();

  const [formDisplayed, setFormDisplayed] = useState(false);
  const [fileInput, setFileInput] = useState({
    file: '',
  });
  const [inProgress, setInProgress] = useState(false);
  const [success, setSuccess] = useState();
  const [error, setError] = useState();

  const {loading, tournament, tournamentUpdated} = useTournament(tournamentIdentifier);

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
    setInProgress(false);

    tournamentUpdated();
  }

  const uploadTheFile = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', fileInput.file);

    const uri = `/tournaments/${tournament.identifier}/logo_upload`;
    const requestConfig = {
      method: 'post',
      data: formData,
    };
    setInProgress(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: onSuccess,
      onFailure: (_) => setError('File failed to upload'),
    });
  }

  if (loading || !tournament) {
    return 'PLACEHOLDER';
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
                    disabled={inProgress}
                    onClick={uploadTheFile}>
              {inProgress && (
                <span>
                  <span className={'spinner-border spinner-border-sm me-2'} role={'status'} aria-hidden={true}></span>
                </span>
              )}
              Upload
            </Button>
          </Form.Group>
        </div>
      )}
      <SuccessAlert message={success}
                    className={`mx-3`}
                    onClose={() => setSuccess(null)}/>
      <ErrorAlert message={error}
                  className={`mx-3`}
                  onClose={() => setError(null)}/>
    </Card>
  );
}

export default ImageUpload;
