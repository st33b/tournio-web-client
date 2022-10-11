import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {fetchBowlerDetails, fetchTournamentDetails, useClientReady} from "../../utils";
import {useCommerceContext} from "../../store/CommerceContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Menu from '../../components/Commerce/Menu';
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const {success, identifier} = router.query;
  const {commerce, dispatch} = useCommerceContext();

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [enablePurchase, setEnablePurchase] = useState(true);

  // fetch the bowler details
  useEffect(() => {
    if (!identifier || !commerce) {
      return;
    }

    if (!commerce.bowler || commerce.bowler.identifier !== identifier) {
      fetchBowlerDetails(identifier, dispatch);
      return;
    }
  }, [identifier, commerce]);

  // // fetch the tournament details
  // useEffect(() => {
  //   if (!commerce.bowler) {
  //     return;
  //   }
  //   const tournamentIdentifier = commerce.bowler.tournament.identifier;
  //   fetchTournamentDetails(tournamentIdentifier)
  // }, [commerce.bowler])

  useEffect(() => {
    if (success === 'purchase') {
      setSuccessMessage('Your purchase was completed. Thank you for supporting our tournament!');
    } else if (success === 'register') {
      setSuccessMessage('Your registration was received! You may now select events, optional items, and pay entry fees.');
    }
  }, [success]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  if (!commerce || !commerce.bowler || !commerce.tournament) {
    return <LoadingMessage message={'One moment, please...'} />;
  }

  if (commerce.bowler.shift_info.full && !commerce.bowler.shift_info.confirmed) {
    if (commerce.bowler.unpaid_purchases.some(p => p.category === 'ledger' || p.determination === 'event')) {
      // either the tournament is full, or the chosen shift is full.
      // first, see if there are available shifts
      // if (commerce.tournament.available_shifts.length > 0) {
      //   setErrorMessage("Your team's requested shift is full. Please contact the tournament director about changing to another shift before paying your entry fee.");
      //   setEnablePurchase(false);
      // } else {
      setErrorMessage("The tournament has reached its maximum capacity. Your registration is now provisional.");
      setEnablePurchase(false);
      // }
    }
  }

  let displayed_name = commerce.bowler.first_name;
  if (commerce.bowler.preferred_name) {
    displayed_name = commerce.bowler.preferred_name;
  }
  const name = displayed_name + ' ' + commerce.bowler.last_name;

  return (
    <div>
      <Row className={'pt-2 g-0'}>
        <Col xs={3} md={2} className={''}>
          <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo url={commerce.tournament.image_url}/>
          </a>
        </Col>
        <Col xs={9} md={10} className={'d-flex flex-column justify-content-center text-md-start ps-2'}>
          <h3 className={'p-0 m-0'}>
            <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
              {commerce.tournament.name}
            </a>
          </h3>
          <h4 className={'p-0 my-2 my-md-3'}>
            Bowler: {name}
          </h4>
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