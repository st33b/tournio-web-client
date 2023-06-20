import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {fetchBowlerDetails, fetchTournamentDetails, useClientReady} from "../../utils";
import {useCommerceContext} from "../../store/CommerceContext";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Menu from '../../components/Commerce/Menu';
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import PreviousPurchases from "../../components/Commerce/PreviousPurchases/PreviousPurchases";
import FreeEntryForm from "../../components/Commerce/FreeEntryForm/FreeEntryForm";
import CommerceLayout from "../../components/Layout/CommerceLayout/CommerceLayout";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";

const Page = () => {
  const router = useRouter();
  const {success, identifier} = router.query;
  const {commerce, dispatch} = useCommerceContext();

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [enablePurchase, setEnablePurchase] = useState(true);

  const onFetchFailure = (response) => {
    if (response.status === 404) {
      setErrorMessage('The requested bowler was not found.');
    }
  }

  // fetch the bowler details
  useEffect(() => {
    if (!identifier || !commerce) {
      return;
    }

    if (!commerce.bowler || commerce.bowler.identifier !== identifier) {
      fetchBowlerDetails(identifier, dispatch, onFetchFailure);
      return;
    }
  }, [identifier, commerce]);

  useEffect(() => {
    if (success === 'purchase') {
      setSuccessMessage('Your purchase was completed. Thank you for supporting our tournament!');
    } else if (success === 'register') {
      setSuccessMessage('Your registration was received! You may now select events, optional items, and pay entry fees.');
    } else if (success === 'expired') {
      setErrorMessage('Checkout was not successful.');
    }
  }, [success]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  if (!commerce) {
    return <LoadingMessage message={'One moment, please...'}/>;
  }

  if (commerce.bowler && commerce.bowler.shift_info.full && !commerce.bowler.shift_info.confirmed) {
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

  let displayed_name = '';
  let name = '';
  if (commerce.bowler) {
    displayed_name = commerce.bowler.first_name;
    if (commerce.bowler.preferred_name) {
      displayed_name = commerce.bowler.preferred_name;
    }
    name = displayed_name + ' ' + commerce.bowler.last_name;
  }

  return (
    <div>
      {commerce.tournament && commerce.bowler && (
        <Row className={``}>
          <Col className={'col-3 col-md-1'}>
            <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
              <TournamentLogo url={commerce.tournament.image_url}/>
            </a>
          </Col>
          <Col className={'d-none d-md-block col-md-3'}>
            <h4 className={``}>
              <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
                {commerce.tournament.name}
              </a>
            </h4>
          </Col>
          <Col xs={9} md={4} className={'ps-2'}>
            <h3 className={``}>
              Bowler: {name}
            </h3>
            {commerce.bowler.team_identifier && (
              <h4>
                <a href={`/teams/${commerce.bowler.team_identifier}`}>
                  Team: {commerce.bowler.team_name}
                </a>
              </h4>
            )}
            {!commerce.bowler.has_free_entry && <FreeEntryForm/>}
          </Col>
          <Col className={`d-none d-md-block col-md-4`}>
            <h4>
              Paid Items
            </h4>
            <PreviousPurchases/>
          </Col>
        </Row>
      )}

      <hr/>

      <SuccessAlert className={``}
                    message={successMessage}
                    onClose={() => setSuccessMessage(null)}/>
      <ErrorAlert className={``}
                  message={errorMessage}
                  onClose={() => setErrorMessage(null)}/>

      {commerce.bowler && enablePurchase && <Menu/>}

    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <CommerceLayout>
      {page}
    </CommerceLayout>
  );
}

export default Page;
