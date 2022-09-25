import {useRouter} from "next/router";

import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import {useLoggedIn} from "../../../director";

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

  return (
    <div>
      <h3>OMG new tournament!</h3>
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