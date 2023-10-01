import {useLoginContext} from "../../../store/LoginContext";
import {useRouter} from "next/router";
import {useEffect} from "react";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import Page from "./[identifier]";

const Me = () => {
  const {user, ready} = useLoginContext();
  const router = useRouter();

  useEffect(() => {
    if (!ready || !router || !user) {
      return;
    }

    router.replace(`/director/users/${user.identifier}`);
  }, [ready, router, user]);

  return '';
}

Me.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Me;
