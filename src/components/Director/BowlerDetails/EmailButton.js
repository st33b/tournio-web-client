import classes from './EmailButton.module.scss';
import {directorApiRequest} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";
import {useRouter} from "next/router";
import {useRef, useState} from "react";
import {Overlay, Popover} from "react-bootstrap";

const EmailButton = ({bowlerIdentifier, emailType, orderIdentifier, orderCredit}) => {
  const context = useDirectorContext();
  const router = useRouter();
  const target = useRef(null);

  const [showPopover, setShowPopover] = useState(false);

  const onSuccess = () => {
    setShowPopover(true);
  }

  const onFailure = () => {
    console.log("Failure", data);
  }

  const sendClicked = () => {
    const uri = `/director/bowlers/${bowlerIdentifier}/resend_email`;
    const requestConfig = {
      method: 'post',
      data: {
        type: emailType,
        order_identifier: orderIdentifier,
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: onSuccess,
      onFailure: onFailure,
    })
  }

  let buttonClass = '';
  let buttonLabel = '';
  if (emailType === 'registration') {
    buttonClass = 'btn-outline-primary';
    buttonLabel = (
      <div>
        Registration Confirmation
      </div>
    );
  } else {
    buttonClass = 'btn-outline-success';
    buttonLabel = (
      <div>
        Payment Receipt
        <span className={classes.PaymentIdentifier}>
            {orderIdentifier} <strong>(${orderCredit})</strong>
          </span>
      </div>
    );
  }

  return (
    <div className={`${classes.EmailButton} d-flex align-items-center`}>
      <button type={'button'}
              className={`btn btn-sm ${buttonClass} me-2`}
              title={'Click to re-send this email'}
              ref={target}
              onClick={sendClicked}>
        <i className={'bi-box-arrow-right'} aria-hidden={true}/>
        <span className={'visually-hidden'}>
          Send
        </span>
      </button>

      <Overlay target={target.current}
               rootClose={true}
               onHide={() => { setShowPopover(false)}}
               show={showPopover}
               placement={'left'}>
        {(props) => (
          <Popover id={`popover-${bowlerIdentifier}`} {...props}>
            <Popover.Body>
              Sent!
            </Popover.Body>
          </Popover>
        )}
      </Overlay>

      {buttonLabel}
    </div>
  )
}

export default EmailButton;