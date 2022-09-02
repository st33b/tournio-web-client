import {useState} from "react";
import {useRouter} from "next/router";

import {purchaseDetailsPostData, postPurchaseDetails} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {stripeCheckoutSessionInitiated} from "../../../store/actions/registrationActions";

import classes from './StripeCheckout.module.scss';

const StripeCheckout = () => {
  const {commerce, commerceDispatch} = useRegistrationContext();
  const router = useRouter();

  const {identifier} = router.query;

  const [requestInProgress, setRequestInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // If Stripe checkout isn't enabled, bail out
  if (!process.env.NEXT_PUBLIC_ENABLE_STRIPE_CHECKOUT) {
    console.log('Stripe checkout not enabled');
    return '';
  }

  // If we don't have all the data we need, bail out
  if (!commerce || !commerce.bowler || !identifier) {
    console.log('missing required data');
    return '';
  }

  ///////////////////////////////////////////////////////

  const postDetailsSucceeded = (responseData) => {
    // grab the checkout session id before redirecting, so we can poll for results upon completion
    const csId = responseData.checkout_session_id;
    commerceDispatch(stripeCheckoutSessionInitiated(csId));

    // Redirect to the URL in the response data
    location = responseData.redirect_to;
    // that's it!
  }

  const postDetailsFailed = (responseData) => {
    // Convey the error message in the response data
    setRequestInProgress(false);
    setErrorMessage('Le sigh...');
    console.log(responseData);
  }

  const buttonClicked = () => {
    setRequestInProgress(true);
    postPurchaseDetails(identifier,
      'stripe_checkout',
      purchaseDetailsPostData(commerce.cart),
      postDetailsSucceeded,
      postDetailsFailed
    );
  }

  const sum = (runningTotal, currentValue) => runningTotal + currentValue.value * (currentValue.quantity || 1);
  const totalFees = commerce.cart.reduce(sum, 0);
  const checkoutDisabled = totalFees === 0;

  return (
    <div className={classes.StripeCheckout}>
      <div className={`d-flex flex-row-reverse pb-3 pb-md-0`}>
        {!requestInProgress && (
          <button className={'btn btn-lg btn-success'}
                  disabled={checkoutDisabled}
                  onClick={buttonClicked}>
            Get Striped!
          </button>
        )}
        {requestInProgress && (
          <button className={'btn btn-lg btn-success'}
                  disabled>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing
          </button>
        )}
      </div>
      {errorMessage && (
        <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3'}
             role={'alert'}>
          <i className={'bi-exclamation-triangle-fill pe-2'} aria-hidden={true}/>
          <div className={'me-auto'}>
            {errorMessage}
            <button type="button"
                    className={"btn-close"}
                    data-bs-dismiss="alert"
                    onClick={() => setErrorMessage(null)}
                    aria-label="Close"/>
          </div>
        </div>
      )}
    </div>
  );
}

export default StripeCheckout;