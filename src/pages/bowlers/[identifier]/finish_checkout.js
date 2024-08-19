import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useCommerceContext} from "../../../store/CommerceContext";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {devConsoleLog, getCheckoutSessionStatus, useClientReady} from '../../../utils';
import {stripeCheckoutSessionCompleted} from '../../../store/actions/registrationActions';
import CommerceLayout from "../../../components/Layout/CommerceLayout/CommerceLayout";

const Page = () => {
  devConsoleLog("------------ page untouched in team restoration");
  const router = useRouter();
  const {commerce, dispatch} = useCommerceContext();
  const {identifier} = router.query;
  const [errorMessage, setErrorMessage] = useState();
  const ready = useClientReady();

  // Do we have an identifier and a commerce object?
  useEffect(() => {
    if (identifier === undefined || !commerce) {
      return;
    }

    // If the bowler in context doesn't match the bowler in the URI, we need to bail out
    if (commerce.bowler && commerce.bowler.identifier !== identifier) {
      router.push('/');
    }
  }, [identifier, commerce.bowler, router]);

  // If we have a commerce object but no checkout session id, then we're done, and can redirect with success.
  useEffect(() => {
    if (!commerce) {
      return;
    }
    if (!commerce.checkoutSessionId) {
      router.push(`/bowlers/${identifier}?success=2`);
    }
  }, [commerce.checkoutSessionId]);

  // once we have a commerce object, begin polling for changes to the checkout session id's status
  useEffect(() => {
    if (!commerce || !identifier || !ready) {
      return;
    }

    if (commerce.checkoutSessionId) {
      devConsoleLog("First call to checkTheStatus! with identifier", identifier);
      checkTheStatus();
    }
  }, [ready, identifier]);

  const checkTheStatus = (count = 0) => {
    if (count < 10) {
      console.log("On attempt #", count);
      getCheckoutSessionStatus(commerce.checkoutSessionId, (d) => success(d, count + 1), failure);
    } else {
      console.log('No more attempts left.');
      // We should do something dramatic here:
      // - show a failure message to the bowler
      // - try to send a notification to bugreport@tourn.io (one that I'll receive) with details
    }
  }

  const success = (data, count) => {
    devConsoleLog("Success callback", data);
    if (data.status === 'completed') {
      // It'd be nice to get a report here, how high did "count" get before we had the full details from Stripe?
      dispatch(stripeCheckoutSessionCompleted());
    } else if (data.status === 'expired') {
      router.push(`/bowlers/${identifier}?error=1`);
    } else {
      devConsoleLog('But our status is not completed. Trying again.');
      setTimeout(() => checkTheStatus(count), 2 ** count * 10);
    }
  }

  const failure = (data) => {
    console.log("Failure callback", data);
    setErrorMessage(data.error);
  }

  if (!ready) {
    return null;
  }

  return (
    <div className={'mt-4'}>
      {!errorMessage &&
          <LoadingMessage message={'Finishing checkout, just a moment...'} />
      }
      {errorMessage && (
        <>
          <div className={'alert alert-danger fade show d-flex align-items-center'}
               role={'alert'}>
            <div className={'me-auto'}>
              <i className={'bi-exclamation-circle pe-2'} aria-hidden={true}/>
              {errorMessage}
              <p className={'mt-3'}>
                Please <a href={'mailto:info@tourn.io?subject=Error%20report'}>report this</a> to us!
              </p>
            </div>
          </div>
          <p className={'mt-3'}>
            <a href={`/bowlers/${identifier}`}>
              <i className={'bi-arrow-left pe-2'} aria-hidden={true}/>
              Back to cart
            </a>
          </p>
        </>
        )}
    </div>
  )
}

Page.getLayout = function getLayout(page) {
  return (
    <CommerceLayout>
      {page}
    </CommerceLayout>
  );
}

export default Page;
