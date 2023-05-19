import {useEffect} from "react";

import {useClientReady} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import {useCommerceContext} from "../../store/CommerceContext";
import {reset} from "../../store/actions/registrationActions";

import RegistrationLayout from '../../components/Layout/RegistrationLayout/RegistrationLayout';
import TournamentCards from "../../components/Registration/TournamentListing/TournamentCards";

const Page = () => {
  const registrationContext = useRegistrationContext();
  const commerceContext = useCommerceContext();

  useEffect(() => {
    registrationContext.dispatch(reset());
    commerceContext.dispatch(reset());
  });

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  return (
    <div>
      <h2 className={'mt-1 mb-3 text-center'}>
        Upcoming Tournaments
      </h2>
      <TournamentCards/>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;
