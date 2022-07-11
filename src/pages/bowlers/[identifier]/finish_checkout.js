import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {getCheckoutSessionStatus} from '../../../utils';
import {stripeCheckoutSessionCompleted} from '../../../store/actions/registrationActions';

const Page = () => {
  const router = useRouter();
  const {commerce, commerceDispatch} = useRegistrationContext();
  const {identifier} = router.query;
  const [errorMessage, setErrorMessage] = useState();

  // Do we have an identifier and a commerce object?
  useEffect(() => {
    if (identifier === undefined || !commerce) {
      return;
    }

    // If the bowler in context doesn't match the bowler in the URI, we need to bail out
    if (commerce.bowler && commerce.bowler.identifier !== identifier) {
      router.push('/');
    }
  }, [identifier, commerce, router]);

  // If we have a commerce object but no checkout session id, then we're done, and can redirect with success.
  useEffect(() => {
    if (!commerce) {
      return;
    }
    if (!commerce.checkoutSessionId) {
      router.push(`/bowlers/${identifier}?success=purchase`);
    }
  }, [commerce.checkoutSessionId]);

  // once we have a commerce object, begin polling for changes to the checkout session id's status
  useEffect(() => {
    if (!commerce) {
      return;
    }

    if (commerce.checkoutSessionId) {
      checkTheStatus();
    }
  }, []);

  const checkTheStatus = () => {
    getCheckoutSessionStatus(commerce.checkoutSessionId, success, failure);
  }

  const success = (data) => {
    if (data.status === 'completed') {
      commerceDispatch(stripeCheckoutSessionCompleted());
      return;
    }
    setTimeout(checkTheThing, 3000);
  }

  const failure = (data) => {
    setErrorMessage(data.error);
  }

  return (
    <div className={'mt-4'}>
      {!errorMessage && <LoadingMessage message={'Finishing checkout, just a moment...'} />}
      {errorMessage && (
        <>
          <div className={'alert alert-danger fade show d-flex align-items-center'}
               role={'alert'}>
            <div className={'me-auto'}>
              <i className={'bi-exclamation-circle pe-2'} aria-hidden={true}/>
              {errorMessage}
              <p className={'mt-3'}>
                Please <a href={'mailto:info@igbo-reg.com?subject=Error%20report'}>report this</a> to us!
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
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;