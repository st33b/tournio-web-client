import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {Col, Row} from "react-bootstrap";

import {apiHost, devConsoleLog, updateObject, useBowlerCommerce} from "../../utils";
import {useCommerceContext} from "../../store/CommerceContext";
import Menu from '../../components/Commerce/Menu';
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import FreeEntryForm from "../../components/Commerce/FreeEntryForm/FreeEntryForm";
import CommerceLayout from "../../components/Layout/CommerceLayout/CommerceLayout";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import TournamentHeader from "../../components/ui/TournamentHeader";
import {commerceDetailsRetrieved, signupableStatusUpdated} from "../../store/actions/registrationActions";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const {identifier, success, error} = router.query;
  const {commerce, dispatch} = useCommerceContext();

  const [state, setState] = useState({
    successMessage: null,
    errorMessage: null,
  });

  const onFetchFailure = (response) => {
    if (response.status === 404) {
      // dispatch(bowlerCommerceDetailsMooted());
      router.push('/404');
    }
    setState({
      ...state,
      errorMessage: response,
    })
  }

  const onFetchSuccess = (response) => {
    if (!response) {
      devConsoleLog("No response object in commerce fetch success, for some reason", identifier);
      return;
    }
    // initialize the reducer for this bowler, but only if they aren't in context yet
    if (commerce && (!commerce.bowler || commerce.bowler.identifier !== identifier)) {
      devConsoleLog("New bowler for context!", response);
      dispatch(commerceDetailsRetrieved({...response}));
    }
  }

  useEffect(() => {
    const updatedState = {...state};
    switch (success) {
      case '1':
        updatedState.successMessage = 'Registration successful! You may now select events, extras, and pay entry fees.';
        break;
      case '2':
        updatedState.successMessage = 'Your purchase is complete.';
        break;
      default:
        break;
    }
    switch (error) {
      case '1':
        updatedState.errorMessage = 'Checkout was not successful';
        break;
    }

    setState(updateObject(state, updatedState));
  }, [success, error]);

  const {loading, data} = useBowlerCommerce(identifier, onFetchSuccess, onFetchFailure);

  if (loading) {
    return <LoadingMessage message={'One moment, please...'}/>;
  }

  if (!data) {
    return <LoadingMessage message={'Almost ready...'}/>;
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

  const {bowler, team, tournament, commerceUpdated} = data;

  const signupableUpdated = (identifier, event, onSuccess = () => {}, onFailure = () => {}) => {
    const requestConfig = {
      method: 'patch',
      url: `${apiHost}/signups/${identifier}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        bowler_identifier: bowler.identifier,
        event: event,
      },
      validateStatus: (status) => {
        return status < 500
      },
    }
    axios(requestConfig)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          onSuccess(response.data);
          dispatch(signupableStatusUpdated(identifier, response.data.signupStatus));
        } else {
          onFailure(response.data);
        }
      })
      .catch(error => {
        onFailure({error: error.message});
      });
  }

  return (
    <div>
      <Row className={``}>
        <Col md={{offset: 2, span: 8}} xl={{offset: 3, span: 6}} className={'ps-2'}>
          <TournamentHeader tournament={tournament}/>

          <h3 className={`text-center`}>
            Bowler: <strong>{bowler.fullName}</strong>
          </h3>
          {team && (
            <h4 className={`text-center`}>
              Team:&nbsp;
              <strong>
                <Link href={{
                  pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/[chosen]',
                  query: {
                    identifier: tournament.identifier,
                    teamIdentifier: team.identifier,
                    chosen: bowler.position,
                  }}}>
                  {team.name}
                </Link>
              </strong>
            </h4>
          )}
          {!bowler.freeEntry && <FreeEntryForm/>}
        </Col>
      </Row>

      <hr/>

      <SuccessAlert className={``}
                    message={state.successMessage}
                    onClose={clearSuccessMessage}/>
      <ErrorAlert className={``}
                  message={state.errorMessage}
                  onClose={clearErrorMessage}/>
      <Menu signupChanged={signupableUpdated}/>

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
