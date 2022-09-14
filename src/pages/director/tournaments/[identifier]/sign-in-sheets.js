import React, {useEffect} from "react";
import {useRouter} from "next/router";

import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {useLoggedIn} from "../../../../director";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const directorState = context.directorState;

  const {identifier} = router.query;

  // Make sure we're logged in
  const loggedInState = useLoggedIn();
  if (!loggedInState) {
    router.push('/director/login');
  }

  // Ensure we're logged in with appropriate permission
  useEffect(() => {
    if (!identifier || !directorState.user) {
      return;
    }
    if (directorState.user.role !== 'superuser' && !directorState.user.tournaments.some(t => t.identifier === identifier)) {
      router.push('/director');
    }
  }, [identifier, router, directorState.user]);

  // Ensure that the tournament in context matches the one identified in the URL
  useEffect(() => {
    if (!identifier || !directorState.tournament) {
      return;
    }
    if (directorState.tournament.identifier !== identifier) {
      router.push('/director');
    }
  }, [identifier, directorState.tournament]);

  // Are we ready?
  const ready = loggedInState >= 0;
  if (!ready || !directorState.bowlers) {
    return '';
  }

  return (
    <div className={'container-md'}>
      {
        directorState.bowlers.map((bowler, i) => <SignInSheet tournament={directorState.tournament} bowler={bowler} key={bowler.identifier} showPrintButton={i === 0}/>)
      }
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return page;
}

export default Page;