import DirectorLayout from "../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useRouter} from "next/router";

import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import {useDirectorApi, useTournament} from "../../../../director";
import {updateObject} from "../../../../utils";

const StripeAccountSetup = () => {
  const router = useRouter();
  // const {tournamentUpdated} = useTournament();

  const {identifier} = router.query;

  const onSuccess = (data) => {
    if (data) {
      // tournamentUpdated();
      location = data.link_url;
    }
  }

  const {data} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/stripe_refresh` : null,
    onSuccess: onSuccess,
  });

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
