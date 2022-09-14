import React, {useEffect} from "react";
import {useRouter} from "next/router";
import DirectorLayout from '../../components/Layout/DirectorLayout/DirectorLayout';
import {useDirectorContext} from "../../store/DirectorContext";
import {useClientReady} from "../../utils";
import {directorLogout} from "../../store/director";
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";

const Logout = () => {
  const router = useRouter();
  const {dispatch} = useDirectorContext();

  useEffect(() => {
    if (!dispatch || !router) {
      return;
    }
    directorLogout({
      dispatch: dispatch,
      onSuccess: () => router.push('/director/login'),
    })
  }, [dispatch, router]);

  const ready = useClientReady();
  if (!ready) {
    return '';
  }

  return (
    <LoadingMessage message={'Logging you out...'} />
  );
}

Logout.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Logout;