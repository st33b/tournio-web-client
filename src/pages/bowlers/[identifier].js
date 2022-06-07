import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {fetchBowlerDetails, fetchTournamentDetails} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Menu from '../../components/Commerce/Menu';
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const {success} = router.query;
  const {commerce, commerceDispatch} = useRegistrationContext();
  const {identifier} = router.query;

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [enablePurchase, setEnablePurchase] = useState(true);

  // fetch the bowler details
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    if (!commerce || !commerce.bowler || commerce.bowler.identifier !== identifier) {
      fetchBowlerDetails(identifier, commerce, commerceDispatch);
      return;
    }

    if (success === 'purchase') {
      setSuccessMessage('Your purchase was completed. Thank you for supporting our tournament!');
    } else if (success === 'register') {
      setSuccessMessage('Your registration was received! You may now select events, optional items, and pay entry fees.');
    }

    if (commerce.bowler.shift_info.full && !commerce.bowler.shift_info.confirmed) {
      if (commerce.bowler.unpaid_purchases.some(p => p.category === 'ledger')) {
        // either the tournament is full, or the chosen shift is full.
        // first, see if there are available shifts
        if (commerce.tournament.available_shifts.length > 0) {
          setErrorMessage("Your team's requested shift is full. Please contact the tournament director about changing to another shift before paying your entry fee.");
          setEnablePurchase(false);
        } else {
          setErrorMessage("The tournament has reached its maximum capacity. Your registration is now provisional.");
          setEnablePurchase(false);
        }
      }
    }
  }, [identifier, commerce, commerceDispatch, success]);

  // ensure that the tournament in context matches the bowler's
  useEffect(() => {
    if (identifier === undefined || !commerce) {
      return;
    }
    if (!commerce.bowler || !commerce.tournament) {
      return;
    }
    if (!commerce.tournament || commerce.bowler.tournament.identifier !== commerce.tournament.identifier) {
      fetchTournamentDetails(commerce.bowler.tournament.identifier, commerceDispatch);
    }
  }, [identifier, commerce, commerceDispatch]);

  if (!commerce || !commerce.bowler || !commerce.tournament) {
    return <LoadingMessage message={'One moment, please...'} />;
  }

  let displayed_name = commerce.bowler.first_name;
  if (commerce.bowler.preferred_name) {
    displayed_name = commerce.bowler.preferred_name;
  }
  const name = displayed_name + ' ' + commerce.bowler.last_name;

  return (
    <div>
      <Row className={'pt-2'}>
        <Col md={2} className={'d-none d-md-block'}>
          <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo tournament={commerce.tournament}/>
          </a>
        </Col>
        <Col md={10} className={'d-flex flex-column justify-content-center text-center text-md-start ps-2'}>
          <h3 className={'p-0 m-0'}>
            <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
              {commerce.tournament.name}
            </a>
          </h3>
          <h4 className={'p-0 my-2 my-md-3'}>
            Bowler: {name}
          </h4>
          {commerce.bowler.team_identifier && (
            <p className={'p-0 m-0'}>
              <a href={`/teams/${commerce.bowler.team_identifier}`}>
                <i className={'bi-arrow-left pe-2'} aria-hidden={true}/>
                back to team
              </a>
            </p>
          )}
        </Col>
      </Row>

      <hr/>

      {successMessage && (
        <div className={'col-12 alert alert-success alert-dismissible fade show d-flex align-items-center'} role={'alert'}>
          <i className={'bi-cash-coin pe-2'} aria-hidden={true}/>
          <div className={'me-auto'}>
            <strong>
              Success!
            </strong>
            {' '}{successMessage}
          </div>
          <button type={'button'} className={'btn-close'} data-bs-dismiss={'alert'} aria-label={'Close'}/>
        </div>
      )}
      {errorMessage && (
        <div className={'col-12 alert alert-warning fade show d-flex align-items-center'} role={'alert'}>
          <i className={'bi-exclamation-triangle-fill pe-2'} aria-hidden={true}/>
          <div className={'me-auto'}>
            {errorMessage}
          </div>
        </div>
      )}

      {enablePurchase && <Menu/>}

    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout showCart={true}>
      {page}
    </RegistrationLayout>
  );
}

export default Page;