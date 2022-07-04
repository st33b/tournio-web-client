import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";

const Page = () => {
  const router = useRouter();
  const {commerce, commerceDispatch} = useRegistrationContext();
  const {identifier} = router.query;

  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    // If the bowler in context doesn't match the bowler in the URI, we need to bail out
    if (commerce.bowler && commerce.bowler.identifier !== identifier) {
      router.push('/');
    }

    if (commerce.cart && commerce.cart.length === 0) {
      return;
    }


  }, [identifier, commerce, router]);

  return (
    <div>
      <h6>Finishing checkout...</h6>
      <p>Here is where we'll check the server for status of the completed checkout.</p>
      <p>Will Stripe give us any query params to tell us which session was completed? That might be useful...</p>
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