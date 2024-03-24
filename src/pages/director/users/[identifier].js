import {useRouter} from "next/router";

import {Col, Row} from "react-bootstrap";

import {useDirectorApi} from "../../../director";
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserForm from '../../../components/Director/UserForm/UserForm';
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const { identifier } = router.query;

  const {loading: userLoading, data: user, onDataUpdate} = useDirectorApi({
    uri: identifier ? `/users/${identifier}` : null,
  });

  const {loading: tournamentOrgsLoading, data: tournamentOrgs} = useDirectorApi({
    uri: '/tournament_orgs',
  });

  const userUpdated = (user) => {
    onDataUpdate(user);
  }
  //////////////////////////////////////////////////////////////////////////

  if (userLoading || tournamentOrgsLoading) {
    return <LoadingMessage message={'Retrieving user details...'}/>
  }

  return (
    <div className={'mt-3'}>
      <Row>
        <Col sm={{span: 8, offset: 2}} md={{span: 6, offset: 3}}>
          <UserForm user={user}
                    tournamentOrgs={tournamentOrgs}
                    onUserUpdated={userUpdated}
          />
        </Col>
      </Row>
    </div>
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
