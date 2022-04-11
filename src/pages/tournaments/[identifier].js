import {useEffect} from "react";
import {useRouter} from "next/router";
import {Row} from "react-bootstrap";

import {fetchTournamentDetails} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";

import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";

const Page = () => {
  const router = useRouter();
  const { entry, dispatch, commerceDispatch } = useRegistrationContext();
  const { identifier } = router.query;

  // fetch the tournament details and put the tournament into context
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    fetchTournamentDetails(identifier, dispatch, commerceDispatch);
   }, [identifier, dispatch, commerceDispatch]);

  if (!entry || !entry.tournament) {
    return '';
  }

  return (
    <div className={classes.TournamentDetails}>
      <Row>
        <div className={'d-none d-md-block col-md-4'}>
          <TournamentLogo tournament={entry.tournament}/>
          <Contacts tournament={entry.tournament}/>
        </div>
        <div className={'col-12 col-md-8'}>
          <TournamentDetails tournament={entry.tournament} />
        </div>
        <div className={'d-md-none col-12'}>
          <Contacts tournament={entry.tournament}/>
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