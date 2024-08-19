import {useTournaments} from "../../utils";

import InformationLayout from '../../components/Layout/InformationLayout/InformationLayout';
import TournamentCards from "../../components/Registration/TournamentListing/TournamentCards";
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../components/common/ErrorAlert";

const Page = () => {
  const {loading, error, tournaments} = useTournaments();

  return (
    <div>
      <h2 className={'mt-3 mb-3'}>
        Upcoming Tournaments
      </h2>
      {loading && <LoadingMessage message={`Retrieving tournaments...`}/>}
      {error && <ErrorAlert className={``}
                            message={`Error while fetching the list of tournaments. ${error}`} />
      }
      {tournaments && <TournamentCards tournaments={tournaments} />}
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <InformationLayout>
      {page}
    </InformationLayout>
  );
}

export default Page;
