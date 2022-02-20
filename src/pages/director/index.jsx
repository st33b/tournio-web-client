// The top-level page for directors

import DirectorLayout from "../../components/Layout/DirectorLayout/DirectorLayout";
import TournamentListing from '../../components/Director/TournamentListing/TournamentListing';
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useAuthContext} from "../../store/AuthContext";

const page = () => {
  const router = useRouter();
  const authContext = useAuthContext();

  useEffect(() => {
    if (!authContext.isLoggedIn) {
      router.push('/director/login');
    }
  });

  return (
    <TournamentListing />
  );
}

page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default page;