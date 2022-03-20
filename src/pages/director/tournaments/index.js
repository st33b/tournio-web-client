import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import TournamentListing from '../../../components/Director/TournamentListing/TournamentListing';
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useDirectorContext} from "../../../store/DirectorContext";

const Page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();

  useEffect(() => {
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
  });

  return (
    <TournamentListing />
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