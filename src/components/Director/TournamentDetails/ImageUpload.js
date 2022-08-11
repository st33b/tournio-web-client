import classes from './ImageUpload.module.scss';

import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Card from 'react-bootstrap/Card';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../utils";
import FormData from 'form-data';

const B2 = require('backblaze-b2');

const ImageUpload = () => {
  const context = useDirectorContext();
  const router = useRouter();

  const [tournament, setTournament] = useState();
  const [fileInput, setFileInput] = useState({
    file: '',
  });

  useEffect(() => {
    if (!context) {
      return;
    }

    setTournament(context.tournament);
  }, [context])

  if (!tournament) {
    return '';
  }

  const whereTheFileIsChanged = (event) => {
    const newValue = {...fileInput};
    newValue.file = event.target.value;
    setFileInput(newValue);
    console.log("New file input value:", newValue.file);
  }

  // From the backblaze-b2 README...
  // const b2 = new B2({
  //   applicationKeyId: process.env.ACCESS_KEY,
  //   applicationKey: process.env.SECRET_KEY,
  //   // // optional:
  //   // axios: {
  //   //   // overrides the axios instance default config, see https://github.com/axios/axios
  //   // },
  //   // retry: {
  //   //   retries: 3 // this is the default
  //   //   // for additional options, see https://github.com/softonic/axios-retry
  //   // }
  // });

  const success = (data) => {
    console.log("Success!", data);
  }

  const failure = (data) => {
    console.log("Failure :(", data);
  }

  const uploadTheFile = (e) => {
    e.preventDefault();
    console.log("Upload clicked, here we go...");
    // try {
    //   console.log("Requesting Backblaze authorization");
    //   await b2.authorize();
    //   console.log("Getting the ID of the bucket named", 'tournio-assets-development');
    //   let bucket = await b2.getBucket({ bucketName: 'tournio-assets-development' });
    //   console.log("Bucket response:", bucket);
    //   // await b2.getUploadUrl({
    //   //   bucketId: ,
    //   //   // ...common arguments (optional)
    //   // });
    // } catch(err) {
    //   console.log("Error!", err);
    // }

    const formData = new FormData();
    formData.append('file', imageFile.files[0]);

    const uri = `/director/tournaments/${context.tournament.identifier}/logo_upload`;
    const requestConfig = {
      method: 'post',
      data: formData,
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: success,
      onFailure: failure,
    });
  }

  return (
    <Card className={'text-center mb-3'}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Logo
      </Card.Header>
      <Card.Body>
        <Form.Group controlId="imageFile" className="mb-3">
          <Form.Label>Logo File Upload</Form.Label>
          <Form.Control type="file"
                        size="sm"
                        className={'mb-2'}
                        onChange={whereTheFileIsChanged}
          />
          <Form.Text id="passwordHelpBlock" muted className={`mt-0`}>
            Something about file
            <strong>
              {' '}
              size or dimension
              {' '}
            </strong>
            limitations.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={'uploadGo'}>
          <Button variant={'primary'}
                  type={'button'}
                  onClick={uploadTheFile}>
            Upload
          </Button>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default ImageUpload;