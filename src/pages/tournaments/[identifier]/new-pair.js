import {useEffect} from "react";
import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newPairRegistrationInitiated} from "../../../store/actions/registrationActions";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    if (!registration || !registration.tournament) {
      return;
    }
    const shift = registration.tournament.shifts[0];
    if (shift && !registration.tournament.registration_options.new_pair) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
    }
  }, [registration]);

  useEffect(() => {
    dispatch(newPairRegistrationInitiated());
    router.push(`/tournaments/${registration.tournament.identifier}/new-pair-bowler`);
  }, [dispatch]);

  return <div>
    <h6 className={'pt-3 text-center'}>Initiating new pair registration...</h6>
  </div>;
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;
