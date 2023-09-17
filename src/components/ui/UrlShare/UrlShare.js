import classes from './UrlShare.module.scss';
import {Popover, OverlayTrigger} from "react-bootstrap";

const UrlShare = ({url}) => {
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

      <div className={'input-group'}>
        <span className={'input-group-text d-none d-md-inline'}>
          Team URL
        </span>
        <input type={'text'}
               className={'form-control'}
               value={url}
               readOnly={true}
        />
        <OverlayTrigger trigger="click" placement="top" overlay={popover}>
          <button className={'btn btn-secondary'}
                  onClick={copyClicked}>
            <i className={'bi bi-copy'} aria-hidden={true}/>
            <span className={'visually-hidden'}>
            Copy
          </span>
          </button>
        </OverlayTrigger>
      </div>
      <p className={'form-text'}>
        Share this URL with your teammates so they can enter their details.
      </p>
    </div>
  );
}

export default UrlShare;
