import {useState} from "react";
import {useRouter} from "next/router";
import {Card, Placeholder} from "react-bootstrap";

import {directorApiDownloadRequest} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './VisibleTournament.module.scss';

const Downloads = ({tournament}) => {
  const context = useDirectorContext();
  const directorState = context.directorState;
  const router = useRouter();
  const [downloadMessage, setDownloadMessage] = useState(null);

  if (!tournament) {
    return (
      <div className={classes.Downloads}>
        <Card>
          <Placeholder animation={'glow'}>
            <Placeholder xs={8} />
            <Placeholder.Button variant="primary" xs={5} />{' '}
            <Placeholder.Button variant="primary" xs={5} />
          </Placeholder>
        </Card>
      </div>
    );
  }

  const downloadSuccess = (data, name) => {
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadMessage(
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          Download completed.
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setDownloadMessage(null)}
                  aria-label="Close" />
        </div>
      </div>
    );
  }
  const downloadFailure = (data) => {
    setDownloadMessage(
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          Download failed. {data.error}
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setDownloadMessage(null)}
                  aria-label="Close" />
        </div>
      </div>
    );
  }
  const downloadClicked = (event, uri, saveAsName) => {
    event.preventDefault();
    directorApiDownloadRequest({
      uri: uri,
      context: context,
      router: router,
      onSuccess: (data) => downloadSuccess(data, saveAsName),
      onFailure: (data) => downloadFailure(data),
    });
  }

  return (
    <div className={classes.Downloads}>
      <Card>
        <Card.Body>
          <Card.Subtitle className={'mb-3'}>
            Downloads
          </Card.Subtitle>
          <a className={'btn btn-sm btn-outline-primary mx-2'}
                     href={'#'}
                     onClick ={(event) => downloadClicked(event, `/director/tournaments/${tournament.identifier}/csv_download`, 'bowlers.csv')}
          >
            CSV
          </a>
          <a className={'btn btn-sm btn-outline-primary mx-2'}
                     href={'#'}
                     onClick ={(event) => downloadClicked(event, `/director/tournaments/${tournament.identifier}/igbots_download`, 'bowlers.xml')}
          >
            IGBO-TS
          </a>
          <a className={'btn btn-sm btn-outline-primary mt-3 mx-2'}
             target={'_new'}
             href={`/director/tournaments/${tournament.identifier}/sign-in-sheets`}
          >
            Sign-in Sheets (beta)
          </a>
          {downloadMessage}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Downloads;
