import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {fetchTeamDetails, fetchTournamentDetails} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";
import TeamDetails from "../../components/Registration/TeamDetails/TeamDetails";
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const { entry, dispatch, commerceDispatch } = useRegistrationContext();
  const { identifier, success } = router.query;

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [enablePurchase, setEnablePurchase] = useState(true);

  const onTeamFetchSuccess = (data) => {
    setLoading(false);
  }

  const onTeamFetchFailure = (data) => {
    setLoading(false);
  }

  // fetch the team details
  useEffect(() => {
    if (identifier === undefined || !entry) {
      return;
    }

    if (!entry.team || entry.team.identifier !== identifier) {
      fetchTeamDetails({
        teamIdentifier: identifier,
        onSuccess: onTeamFetchSuccess,
        onFailure: onTeamFetchFailure,
        dispatches: [dispatch, commerceDispatch],
      });
      return;
    } else {
      setLoading(false);
    }

    if (entry.team.shift_info.full && !entry.team.shift_info.confirmed) {
      // either the tournament is full, or the chosen shift is full.
      // first, see if there are available shifts
      if (entry.tournament.available_shifts.length > 0) {
        setErrorMessage("Your team's requested shift is full. Please contact the tournament director about changing to another shift before paying entry fees.");
        setEnablePurchase(false);
      } else {
        setErrorMessage("The tournament has reached its maximum capacity. Your team's registration is now provisional.");
        setEnablePurchase(false);
      }
    }
  }, [identifier, entry, dispatch, commerceDispatch]);

  // ensure that the tournament in context matches the team's
  useEffect(() => {
    if (identifier === undefined || !entry) {
      return;
    }
    if (!entry.team || !entry.tournament) {
      return;
    }
    if (entry.tournament.identifier !== entry.tournament.identifier) {
      fetchTournamentDetails(entry.team.tournament.identifier, dispatch, commerceDispatch);
    }
  }, [identifier, entry, dispatch, commerceDispatch]);

  if (loading || !entry || !entry.team) {
    return <LoadingMessage message={'Retrieving team details...'} />
  }

  let joinLink = '';
  if (entry.team.size < entry.tournament.max_bowlers && !success) {
    joinLink = (
      <p className={'text-center mt-2'}>
        <a href={`/teams/${entry.team.identifier}/join`}
           className={'btn btn-outline-info'}>
          Join this Team
        </a>
      </p>
    );
  }

  return (
    <div>
      <Row>
        <Col md={4} className={'d-none d-md-block'}>
          <a href={`/tournaments/${entry.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo tournament={entry.tournament}/>
            <h4 className={'text-center py-3'}>
              {entry.tournament.name}
            </h4>
          </a>
          <Contacts tournament={entry.tournament}/>
        </Col>
        <Col xs={12} className={'d-md-none'}>
          <a href={`/tournaments/${entry.tournament.identifier}`} title={'To tournament page'}>
            <h4 className={'text-center'}>
              {entry.tournament.name}
            </h4>
          </a>
        </Col>
        <Col>
          <TeamDetails successType={success} enablePayment={enablePurchase}/>
          {joinLink}

          {errorMessage && (
            <div className={'col-12 alert alert-warning fade show d-flex align-items-center'} role={'alert'}>
              <i className={'bi-exclamation-triangle-fill pe-2'} aria-hidden={true}/>
              <div className={'me-auto'}>
                {errorMessage}
              </div>
            </div>
          )}
        </Col>
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