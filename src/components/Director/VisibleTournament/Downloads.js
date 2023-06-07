import {useState} from "react";
import {Card, Placeholder} from "react-bootstrap";

import {directorApiDownloadRequest} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './VisibleTournament.module.scss';
import {useLoginContext} from "../../../store/LoginContext";
import {devConsoleLog} from "../../../utils";

const Downloads = ({tournament}) => {
  const { ready, authToken } = useLoginContext();
  const { state } = useDirectorContext();
  const [downloadMessage, setDownloadMessage] = useState(null);

  if (!tournament || !ready) {
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
    devConsoleLog("Download succeeded. Go team!");

    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const downloadFailure = (data) => {
    devConsoleLog("Download failed. Why?", data);
    setDownloadMessage(
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          Download failed.
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setDownloadMessage(null)}
                  aria-label="Close" />
        </div>
      </div>
    );
  }
  const downloadClicked = (event, which, saveAsName) => {
    const path = which === 'csv' ? 'csv_download' : 'igbots_download';
    const uri = `/tournaments/${tournament.identifier}/${path}`;
    event.preventDefault();
    directorApiDownloadRequest({
      uri: uri,
      authToken: authToken,
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
                     disabled={!state.bowlers || state.bowlers.length === 0}
                     onClick ={(event) => downloadClicked(event, 'csv', 'bowlers.csv')}
          >
            CSV
          </a>
          <a className={'btn btn-sm btn-outline-primary mx-2'}
                     href={'#'}
                     disabled={!state.bowlers || state.bowlers.length === 0}
                     onClick ={(event) => downloadClicked(event, 'igbots_download', 'bowlers.xml')}
          >
            IGBO-TS
          </a>
          <a className={'btn btn-sm btn-outline-primary mt-3 mx-2'}
             target={'_new'}
             href={`/director/tournaments/${tournament.identifier}/sign-in-sheets`}
             disabled={!state.bowlers || state.bowlers.length === 0}
          >
            Sign-in Sheets
          </a>
          {downloadMessage}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Downloads;
