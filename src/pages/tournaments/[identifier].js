import {useEffect} from "react";
import {useRouter} from "next/router";
import {Row} from "react-bootstrap";

import {fetchTournamentDetails, useClientReady} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";

import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";

const Page = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const { registration, dispatch } = useRegistrationContext();

  // fetch the tournament details and put the tournament into context
  useEffect(() => {
    if (!identifier) {
      return;
    }

    fetchTournamentDetails(identifier, dispatch);
   }, [identifier, dispatch]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration.tournament) {
    return null;
  }

  return (
    <div className={classes.TournamentDetails}>
      <Row>
        <div className={'d-none d-md-block col-md-4'}>
          <TournamentLogo url={registration.tournament.image_url}/>
          <Contacts tournament={registration.tournament}/>
        </div>
        <div className={'col-12 col-md-8'}>
          <TournamentDetails tournament={registration.tournament} />
        </div>
        <div className={'d-md-none col-12'}>
          <Contacts tournament={registration.tournament}/>
        </div>
      </Row>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;