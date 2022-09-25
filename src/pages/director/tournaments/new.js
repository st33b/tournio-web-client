import {useRouter} from "next/router";

import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import {useLoggedIn} from "../../../director";
import TournamentBuilder from "../../../components/Director/TournamentBuilder/TournamentBuilder";

const Page = () => {
  const router = useRouter();
  const loggedInState = useLoggedIn();
  const ready = loggedInState >= 0;
  if (!loggedInState) {
    router.push('/director/login');
  }
  if (!ready) {
    return '';
  }

  const {step} = router.query;

  return (
    <div>
      <TournamentBuilder step={step}/>
    </div>
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