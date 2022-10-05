import DirectorLayout from "../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useEffect} from "react";
import {useRouter} from "next/router";

import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import Breadcrumbs from "../../../../components/Director/Breadcrumbs/Breadcrumbs";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {directorApiRequest, useLoggedIn} from "../../../../director";

import classes from "../../../../components/Director/TournamentInPrep/TournamentInPrep.module.scss";
import {stripeAccountStatusChanged} from "../../../../store/actions/directorActions";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const {directorState, dispatch} = context;

  const onSuccess = (data) => {
    dispatch(stripeAccountStatusChanged(data))
    location = data.link_url;
  }

  useEffect(() => {
    if (!directorState.tournament) {
      return;
    }

    const requestConfig = {
      method: 'get',

    }
    const uri = `/director/tournaments/${directorState.tournament.identifier}/stripe_refresh`;
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: onSuccess,
      onFailure: (data) => console.log("Failure!", data),
    });
  }, [directorState.tournament]);

  const loggedInState = useLoggedIn();
  if (!loggedInState) {
    router.push('/director/login');
  }

  const ready = loggedInState >= 0;
  if (!ready || !directorState.tournament) {
    return (
      <div>
        <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
      </div>
    );
  }

  const ladder = [{ text: 'Tournaments', path: '/director' }];
  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={directorState.tournament.name} className={classes.Breadcrumbs} />
      <LoadingMessage message={'Initiating setup...'} />
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