import DirectorLayout from "../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useDirectorContext} from "../../../../store/DirectorContext";
import Breadcrumbs from "../../../../components/Director/Breadcrumbs/Breadcrumbs";
import classes from "../../../../components/Director/TournamentDetails/TournamentDetails.module.scss";
import {directorApiRequest} from "../../../../utils";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();

  useEffect(() => {
    if (!context.isLoggedIn) {
      router.push('/director/login');
    }
  });

  useEffect(() => {
    const requestConfig = {
      method: 'get',

    }
    const uri = `/director/tournaments/${context.tournament.identifier}/stripe_refresh`;
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: onSuccess,
      onFailure: onFailure,
    });
  }, []);

  const onSuccess = (data) => {
    // router.push(data.link_url);
    location = data.link_url;
  }

  const onFailure = (data) => {
    console.log("Failure!", data);
  }

  if (!context || !context.tournament) {
    return (
      <div>
        <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
      </div>
    );
  }

  const ladder = [{ text: 'Tournaments', path: '/director' }];
  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={context.tournament.name} className={classes.Breadcrumbs} />
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