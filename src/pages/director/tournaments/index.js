import {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {useRouter} from "next/router";

import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import TournamentListing from '../../../components/Director/TournamentListing/TournamentListing';
import {useDirectorContext} from "../../../store/DirectorContext";
import {newTournamentInitiated} from "../../../store/actions/directorActions";
import {directorApiRequest, useLoggedIn} from "../../../director";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const dispatch = context.dispatch;

  const [tournaments, setTournaments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  const fetchTournamentsSuccess = (data) => {
    setTournaments(data);
    setLoading(false);
  }

  const fetchTournamentsFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  useEffect(() => {
    const uri = '/director/tournaments';
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: fetchTournamentsSuccess,
      onFailure: fetchTournamentsFailure,
    });
  }, []);

  const loggedInState = useLoggedIn();
  const ready = loggedInState > 0;
  if (!loggedInState) {
    router.push('/director/login');
  }

  if (!ready || loading) {
    return <LoadingMessage message={'Retrieving data...'} />;
  }

  const newTournamentClicked = (e) => {
    e.preventDefault();
    dispatch(newTournamentInitiated());
    router.push(e.target.href);
  }

  return (
    <>
      {errorMessage && (
        <Row>
          <Col>
            <p className={'text-danger'}>
              {errorMessage}
            </p>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <TournamentListing tournaments={tournaments}/>
        </Col>
      </Row>
      <Row>
        <Col className={'text-center'}>
          <a href={"/director/tournaments/new"}
             className={"btn btn-sm btn-outline-success mx-2"}
             onClick={newTournamentClicked}>
            Create a Tournament
          </a>
        </Col>
      </Row>
    </>
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
