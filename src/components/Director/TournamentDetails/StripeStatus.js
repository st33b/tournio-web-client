import Card from 'react-bootstrap/Card';

import {useDirectorContext} from "../../../store/DirectorContext";
import ErrorBoundary from "../../common/ErrorBoundary";
import {useState, useEffect} from "react";
import {directorApiRequest} from "../../../utils";

import classes from './StripeStatus.module.scss';

const StripeStatus = ({tournament, needStatus}) => {
  const context = useDirectorContext();

  // If needStatus is set, then we need to request the Stripe status from the server
  // Otherwise, show a button that can trigger an on-demand status check

  const [status, setStatus] = useState({requested: false, fetched: false});
  const [errorMessage, setErrorMessage] = useState();
  const [stripeAccount, setStripeAccount] = useState();

  const onStatusFetchSuccess = (data) => {
    console.log("Status has been fetched.");
    setStatus({requested: false, fetched: true});
    setStripeAccount(data);
  }

  const onStatusFetchFailure = (data) => {
    console.log("Status has been fetched (and failed).");
    setStatus({requested: false, fetched: true});
    setErrorMessage(data.error);
  }

  useEffect(() => {
    if (!context || !tournament) {
      return;
    }

    setStripeAccount(tournament.stripe_account);

    if (!needStatus || status.fetched) {
      console.log('Not trying to fetch account status.');
      console.log("status:", status);
      console.log("needStatus:", needStatus);
      return;
    }

    console.log("I don't have status yet.");
    console.log("status:", status);
    console.log("needStatus:", needStatus);

    if (!status.requested) {
      console.log("Requesting status");
      const uri = `/director/tournaments/${tournament.identifier}/stripe_status`;
      const requestConfig = {
        method: 'get',
      };
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        context: context,
        onSuccess: onStatusFetchSuccess,
        onFailure: onStatusFetchFailure,
      });
      setStatus({requested: true, fetched: status.fetched});
    } else {
      console.log("A request is already underway, so I'm not doing another.");
    }
  }, [status, needStatus, tournament]);

  if (!context || !tournament) {
    return '';
  }

  return (
    <ErrorBoundary>
      <Card className={`${classes.StripeStatus}`}>
        <Card.Header as={'h5'} className={'fw-light'}>
          Payment Integration
        </Card.Header>
        <Card.Body>
          {errorMessage && (
            <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center my-2'}
                 role={'alert'}>
              <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
              <div className={'me-auto'}>
                Questions saved.
                <button type="button"
                        className={"btn-close"}
                        data-bs-dismiss="alert"
                        onClick={() => setErrorMessage(null)}
                        aria-label="Close"/>
              </div>
            </div>
          )}
          <div className={'d-flex justify-content-around'}>
            {stripeAccount && (
              <>
                <span>
                  Ready to accept payments?
                </span>
                {stripeAccount.can_accept_payments && (
                  <span className={`text-success ${classes.Ready}`}>
                  <i className={'bi-hand-thumbs-up'} aria-hidden={true}/>
                  <span className={'visually-hidden'}>
                    Yes
                  </span>
                </span>
                )}
                {!stripeAccount.can_accept_payments && (
                  <span className={`text-danger ${classes.NotReady}`}>
                    <i className={'bi-hand-thumbs-down'} aria-hidden={true}/>
                    <span className={'visually-hidden'}>
                      No
                    </span>
                  </span>
                )}
              </>
            )}
          </div>
          <div className={'d-flex justify-content-center'}>
            {stripeAccount && !stripeAccount.can_accept_payments && (
              <a href={`/director/tournaments/${tournament.identifier}/stripe_account_setup`}
                 className={`btn btn-success mt-3`}>
                Resume Setup
              </a>
            )}
            {!stripeAccount && (
              <a href={`/director/tournaments/${tournament.identifier}/stripe_account_setup`}
                 className={`btn btn-success`}>
                Begin Setup
              </a>
            )}
          </div>
        </Card.Body>
      </Card>
    </ErrorBoundary>
  );
}

export default StripeStatus;