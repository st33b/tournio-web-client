import {Col, Row} from "react-bootstrap";
import {useRouter} from "next/router";

import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import TournamentListing from '../../../components/Director/TournamentListing/TournamentListing';
import {useDirectorContext} from "../../../store/DirectorContext";
import {newTournamentInitiated} from "../../../store/actions/directorActions";
import {useDirectorApi} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";

const Page = () => {
  const router = useRouter();
  const {dispatch} = useDirectorContext();
  const {ready, user} = useLoginContext();

  const requestConfig = {
    method: 'get',
  }

  const {loading, data: tournaments, error} = useDirectorApi({
    uri: '/tournaments',
    requestConfig: requestConfig,
  });

  if (!ready || !user) {
    return '';
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving tournaments...'} />;
  }

  const newTournamentClicked = (e) => {
    e.preventDefault();
    dispatch(newTournamentInitiated());
    router.push(e.target.href);
  }

  return (
    <>
      {error && (
        <Row>
          <Col>
            <p className={'text-danger text-center'}>
              Something went wrong.
            </p>
          </Col>
        </Row>
      )}
      {tournaments && (
        <Row>
          <Col>
            <TournamentListing tournaments={tournaments}/>
          </Col>
        </Row>
      )}

      {/* Gate this behind a superuser role check */}
      {user.role === 'superuser' &&
        <Row>
          <Col className={'text-center'}>
            <a href={"/director/tournaments/new"}
               className={"btn btn-sm btn-outline-success mx-2"}
               onClick={newTournamentClicked}>
              Create a Tournament
            </a>
          </Col>
        </Row>
      }
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
