import {useEffect} from "react";
import {useRouter} from "next/router";

import {retrieveTournamentDetails} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";
import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";

const page = () => {
  const router = useRouter();
  const { entry, dispatch, commerceDispatch } = useRegistrationContext();
  const { identifier } = router.query;

  // fetch the tournament details and put the tournament into context
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    retrieveTournamentDetails(identifier, dispatch, commerceDispatch);
   }, [identifier]);

  if (!entry || !entry.tournament) {
    return (
      <div>
        <p>
          Retrieving tournament details...
        </p>
      </div>
    );
  }

  // return <TournamentDetails tournament={entry.tournament} />;
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

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;