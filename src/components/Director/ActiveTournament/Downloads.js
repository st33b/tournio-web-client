import {useState} from "react";
import {useRouter} from "next/router";
import CardHeader from "./CardHeader";
import {devConsoleLog} from "../../../utils";

import classes from './ActiveTournament.module.scss';
import ErrorAlert from "../../common/ErrorAlert";

// Props:
//  - tournament: duh, the tournament
//  - onDownload: function that takes three params:
//    - path: the action name for the server controller
//    - onSuccess: function to call on success that takes the response data as a param
//    - onFailure: function to call on failure that takes a string message
const Downloads = ({tournament, onDownload}) => {
  const router = useRouter();
  const [downloadMessage, setDownloadMessage] = useState(null);

  if (!tournament || !router.isReady) {
    return '';
  }

  const DOWNLOAD_BOWLERS_CSV = 'bowlers-csv';
  const DOWNLOAD_FINANCIAL_CSV = 'financial-csv';
  const DOWNLOAD_BOWLERS_IGBOTS = 'bowlers-igbots';

  const downloadDeets = [
    {
      key: DOWNLOAD_BOWLERS_CSV,
      uriPath: 'csv_download',
      saveAsName: 'bowlers.csv',
      buttonText: 'Bowlers CSV',
    },
    {
      key: DOWNLOAD_FINANCIAL_CSV,
      uriPath: 'financial_csv_download',
      saveAsName: 'financial.csv',
      buttonText: 'Financial CSV',
    },
    {
      key: DOWNLOAD_BOWLERS_IGBOTS,
      uriPath: 'igbots_download',
      saveAsName: 'bowlers.xml',
      buttonText: 'IGBO-TS XML',
    }
  ]

  const downloadSuccess = (data, name) => {
    devConsoleLog("Download succeeded. Rock and roll!");

    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const downloadError = (error) => {
    devConsoleLog("Download failed. Why?", error);
    setDownloadMessage('Download failed.');
  }

  const downloadClicked = (event, which) => {
    event.preventDefault();
    const deets = downloadDeets.find(({key}) => key === which);

    onDownload(deets.uriPath, (data) => downloadSuccess(data, deets.saveAsName), downloadError);
  }

  return (
    <div className={classes.Downloads}>
      <div className={'card mb-3'}>
        <CardHeader headerText={'Downloads'}/>

        <div className={'list-group list-group-flush'}>
          {downloadDeets.map(deets => (
            <button key={`download-button--${deets.key}`}
                    disabled={tournament.bowlerCount === 0}
                    className={'list-group-item list-group-item-action'}
                    onClick={(e) => downloadClicked(e, deets.key)}
            >
              <i className={'bi bi-download pe-2'}
                 aria-hidden={"true"}/>
              {deets.buttonText}
            </button>
          ))}

          {tournament.bowlerCount > 0 && (
            <a href={`${router.asPath}/sign-in-sheets`}
               target={'_blank'}
               title={'Open the sign-in sheets in a new window'}
               className={`list-group-item list-group-item-action`}
            >
              Sign-in Sheets
              <i className={`bi bi-box-arrow-up-right ${classes.ExternalLink}`}
                 aria-hidden={"true"}/>
            </a>
          )}
        </div>
      </div>
      <ErrorAlert message={downloadMessage}
                  className={`my-3`}
                  onClose={() => setDownloadMessage(null)}/>
    </div>
  );
};

export default Downloads;
