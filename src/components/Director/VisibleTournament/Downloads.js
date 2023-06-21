import {useState} from "react";
import {Card, Placeholder} from "react-bootstrap";

import {directorApiDownloadRequest, useTournament} from "../../../director";

import classes from './VisibleTournament.module.scss';
import {useLoginContext} from "../../../store/LoginContext";
import {devConsoleLog} from "../../../utils";
import Link from "next/link";
import SuccessAlert from "../../common/SuccessAlert";
import ErrorAlert from "../../common/ErrorAlert";

const Downloads = () => {
  const { ready, authToken } = useLoginContext();
  const [downloadMessage, setDownloadMessage] = useState(null);
  const {tournament} = useTournament();

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
    setDownloadMessage('Download failed.');
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
          <Link className={'btn btn-sm btn-outline-primary mx-2'}
                     href={'#'}
                     disabled={tournament.bowler_count === 0}
                     onClick ={(event) => downloadClicked(event, 'csv', 'bowlers.csv')}
          >
            CSV
          </Link>
          <Link className={'btn btn-sm btn-outline-primary mx-2'}
                     href={'#'}
                     disabled={tournament.bowler_count === 0}
                     onClick ={(event) => downloadClicked(event, 'igbots_download', 'bowlers.xml')}
          >
            IGBO-TS
          </Link>
          <Link className={'btn btn-sm btn-outline-primary mt-3 mx-2'}
             target={'_new'}
             href={`/director/tournaments/${tournament.identifier}/sign-in-sheets`}
             disabled={tournament.bowler_count === 0}
          >
            Sign-in Sheets
          </Link>
          <ErrorAlert message={downloadMessage}
                      className={`mt-3 mb-0`}
                      onClose={() => setDownloadMessage(null)}
                      />
        </Card.Body>
      </Card>
    </div>
  );
}

export default Downloads;
