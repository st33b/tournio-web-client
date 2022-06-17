import RegistrationLayout from '../../components/Layout/RegistrationLayout/RegistrationLayout';
import TournamentCards from "../../components/Registration/TournamentListing/TournamentCards";

const Page = () => {
  return (
    <div>
      <h2 className={'mt-1 mb-3'}>
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