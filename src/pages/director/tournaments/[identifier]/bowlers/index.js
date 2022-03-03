import {useEffect} from "react";
import {useRouter} from "next/router";
import {useDirectorContext} from "../../../../../store/DirectorContext";
import DirectorLayout from "../../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useParams} from "react-router-dom";
import BowlerListing from "../../../../../components/Director/BowlerListing/BowlerListing";

const page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();

  let {identifier} = useParams();

  if (!directorContext) {
    return '';
  }

  useEffect(() => {
    if (!identifier) {
      return;
    }
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
    if (!directorContext.user.tournaments.some(t => t.identifier === identifier)) {
      console.log(`Did not find ${identifier} in the user's tournaments`);
      router.push('/director');
    }
  }, [identifier]);

  return (
    <BowlerListing />
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