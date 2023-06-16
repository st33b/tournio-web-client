import DirectorLayout from "../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useRouter} from "next/router";

import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {useDirectorApi} from "../../../../director";
import {stripeAccountStatusChanged} from "../../../../store/actions/directorActions";

const Page = () => {
  const router = useRouter();
  const {dispatch} = useDirectorContext();

  const {identifier} = router.query;

  const {data} = useDirectorApi({
    uri: identifier ? `/tournaments/${tournamentId}/stripe_refresh` : null,
  });

  if (data) {
    dispatch(stripeAccountStatusChanged(data));
    location = data.link_url;
  }

  return (
    <LoadingMessage message={'Checking status...'}/>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Page;
