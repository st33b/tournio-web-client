import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {devConsoleLog, fetchBowlerDetails, fetchTournamentDetails, updateObject, useClientReady} from "../../utils";
import {useCommerceContext} from "../../store/CommerceContext";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Menu from '../../components/Commerce/Menu';
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import PreviousPurchases from "../../components/Commerce/PreviousPurchases/PreviousPurchases";
import FreeEntryForm from "../../components/Commerce/FreeEntryForm/FreeEntryForm";
import CommerceLayout from "../../components/Layout/CommerceLayout/CommerceLayout";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import TournamentHeader from "../../components/ui/TournamentHeader";

const Page = () => {
  const router = useRouter();
  const {identifier, success, error} = router.query;
  const {commerce, dispatch} = useCommerceContext();

  // TODO Remove these deprecated state values
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [state, setState] = useState({
    successMessage: null,
    errorMessage: null,
  });

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
    }
  }, [identifier, commerce]);

  useEffect(() => {
    const updatedState = {...state};
    switch (success) {
      case '1':
        updatedState.successMessage = 'Registration successful! You may now select events, extras, and pay entry fees.';
        break;
      case '2':
        updatedState.successMessage = 'Your purchase is complete.';
      default:
        break;
    }
    switch (error) {
      case '1':
        updatedState.errorMessage = 'Checkout was not successful';
        break;
    }

    // TODO Remove these deprecated messages
    if (success === 'purchase') {
      updatedState.successMessage = 'Your purchase was completed. Thank you for supporting our tournament!';
    } else if (success === 'register') {
      updatedState.successMessage = 'Your registration was received! You may now select events, optional items, and pay entry fees.';
    } else if (success === 'expired') {
      updatedState.errorMessage = 'Checkout was not successful.';
    }

    setState(updateObject(state, updatedState));
  }, [success, error]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  if (!commerce) {
    return <LoadingMessage message={'One moment, please...'}/>;
  }

  const clearSuccessMessage = () => {
    setState(updateObject(state, {
      successMessage: null,
    }));
  }

  const clearErrorMessage = () => {
    setState(updateObject(state, {
      errorMessage: null,
    }));
  }

  return (
    <div>
      {commerce.tournament && commerce.bowler && (
        <Row className={``}>
          <Col md={{offset: 2, span: 8}} xl={{offset: 3, span: 6}} className={'ps-2'}>
            <TournamentHeader tournament={commerce.tournament}/>

            <h3 className={`text-center`}>
              Bowler: <strong>{commerce.bowler.full_name}</strong>
            </h3>
            {commerce.bowler.team_identifier && (
              <h4 className={`text-center`}>
                Team: <strong>{commerce.bowler.team_name}</strong>
              </h4>
            )}
            {!commerce.bowler.has_free_entry && <FreeEntryForm/>}
          </Col>
        </Row>
      )}

      <hr/>

      <SuccessAlert className={``}
                    message={state.successMessage}
                    onClose={clearSuccessMessage}/>
      <ErrorAlert className={``}
                  message={state.errorMessage}
                  onClose={clearErrorMessage}/>

      {commerce.bowler && <Menu/>}

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
