import {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {Col, Row} from "react-bootstrap";

import {directorApiRequest, useLoggedIn} from "../../../director";
import {useDirectorContext} from '../../../store/DirectorContext';
import DirectorLayout from '../../../components/Layout/DirectorLayout/DirectorLayout';
import UserForm from '../../../components/Director/UserForm/UserForm';

const Page = () => {
  const context = useDirectorContext();
  const directorState = context.directorState;
  const router = useRouter();
  const { identifier } = router.query;

  const isSuperuser = directorState.user && directorState.user.role === 'superuser';
  const isEditingSelf = directorState.user && directorState.user.identifier === identifier;

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState();

  useEffect(() => {
    if (identifier === undefined) {
      return;
    }
    if (!isSuperuser && !isEditingSelf) {
      router.push('/director');
    }
  });

  useEffect(() => {
    if (!identifier || !directorState.users) {
      return;
    }

    setUser(directorState.users.find(u => u.identifier === identifier));
  }, [identifier]);

  const fetchTournamentsSuccess = (data) => {
    setTournaments(data);
    setLoading(false);
  }

  const fetchTournamentsFailure = (data) => {
    setLoading(false);
    setTournaments([]);
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


  // Make sure we're logged in and ready to go
  const loggedInState = useLoggedIn();
  const ready = loggedInState >= 0;
  if (!ready) {
    return '';
  }
  if (!loggedInState) {
    router.push('/director/login');
  }
  if (!directorState) {
    return '';
  }

  return (
    <div className={'mt-3'}>
      <Row>
        <Col sm={{span: 8, offset: 2}} md={{span: 6, offset: 3}}>
          <UserForm user={user}
                    tournaments={tournaments}
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
