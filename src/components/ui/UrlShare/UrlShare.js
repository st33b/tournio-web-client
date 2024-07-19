import classes from './UrlShare.module.scss';
import {Popover, OverlayTrigger} from "react-bootstrap";

const UrlShare = ({url, fullTeam = false, admin = false}) => {
  const copyClicked = () => {
    navigator.clipboard.writeText(url).then(
      () => {
      },
      () => {
      },
    );
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body className={'text-success-emphasis'}>
        Copied!
      </Popover.Body>
    </Popover>
  );

  return (
    <div className={classes.UrlShare}>
      <div className={'d-block d-md-flex align-items-center'}>
        <p className={`${classes.Label}`}>
          Team URL:
        </p>
        <p className={`ps-2 flex-grow-1 ${classes.Url}`}>
          {url}
        </p>
        <p className={`${classes.CopyButton}`}>
          <OverlayTrigger trigger="click"
                          placement="top"
                          overlay={popover}>
            <button className={'btn btn-secondary'}
                    title={"Click to copy this URL to your clipboard"}
                    onClick={copyClicked}>
              <i className={'bi bi-copy'} aria-hidden={true}/>
              <span className={'ps-2'}>
                Copy
              </span>
            </button>
          </OverlayTrigger>
        </p>
      </div>

      <p className={`${classes.Instructions}`}>
        {!admin && fullTeam && (
          'You and your teammates can use this URL to come back later and pay your entry fees.'
        )}
        {!admin && !fullTeam && (
          'Use this URL to add your teammates later, or share it with them so they can add their information themselves.'
        )}
        {admin && (
          'Team members can use this URL to join the team (if applicable) or pay their entry fees.'
        )}
      </p>
    </div>
  );
}

export default UrlShare;
