// The top-level page for bowlers

import RegistrationLayout from '../components/Layout/RegistrationLayout/RegistrationLayout';
import TournamentListing from "../components/Registration/TournamentListing/TournamentListing";

const page = () => {
  return (
    <TournamentListing />
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