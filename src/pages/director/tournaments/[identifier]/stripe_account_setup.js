import DirectorLayout from "../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useRouter} from "next/router";

import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import {useDirectorApi, useTournament} from "../../../../director";
import {updateObject} from "../../../../utils";

const StripeAccountSetup = () => {
  const router = useRouter();
  const {tournament, tournamentUpdatedQuietly} = useTournament();

  const {identifier} = router.query;

  const {data} = useDirectorApi({
    uri: identifier ? `/tournaments/${tournament.identifier}/stripe_refresh` : null,
  });

  if (data) {
    const modifiedTournament = updateObject(tournament, {
      stripe_account: data,
    });
    tournamentUpdatedQuietly(modifiedTournament);
    location = data.link_url;
  }

  return (
    <LoadingMessage message={'Checking status...'}/>
  );
}

StripeAccountSetup.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default StripeAccountSetup;
