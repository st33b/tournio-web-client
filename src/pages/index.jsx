import RegistrationLayout from '../components/Layout/RegistrationLayout/RegistrationLayout';
import TournamentListing from "../components/Registration/TournamentListing/TournamentListing";

import {apiHost} from "../utils";

const page = () => {
  return (
    <div>
      <TournamentListing />
      <p className={'text-center'}>
        <code>{apiHost}</code>
      </p>
    </div>

  );
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;