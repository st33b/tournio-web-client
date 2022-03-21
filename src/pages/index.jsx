import RegistrationLayout from '../components/Layout/RegistrationLayout/RegistrationLayout';
import TournamentListing from "../components/Registration/TournamentListing/TournamentListing";

const Page = () => {
  return <TournamentListing />;
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;