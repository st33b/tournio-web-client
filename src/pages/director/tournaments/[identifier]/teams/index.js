import {useEffect} from "react";
import {useRouter} from "next/router";
import {useDirectorContext} from "../../../../../store/DirectorContext";
import DirectorLayout from "../../../../../components/Layout/DirectorLayout/DirectorLayout";
import TeamListing from "../../../../../components/Director/TeamListing/TeamListing";

const page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();

  let {identifier} = router.query;

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
      router.push('/director');
    }
  }, [identifier]);

  return (
    <TeamListing />
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