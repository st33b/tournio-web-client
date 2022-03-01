import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {fetchBowlerDetails} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Menu from '../../components/Commerce/Menu';

const page = () => {
  const router = useRouter();
  const {success, error} = router.query;
  const {commerce, commerceDispatch} = useRegistrationContext();
  const {identifier} = router.query;

  const [loading, setLoading] = useState(true);
  const [bowler, setBowler] = useState(null);

  // fetch the bowler details
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    if (commerce.bowler && commerce.bowler.identifier === identifier) {
      setBowler(commerce.bowler);
      setLoading(false);
    } else {
      fetchBowlerDetails(identifier, commerceDispatch);
    }
  }, [identifier, commerce]);

  if (loading) {
    return (
      <div>
        <p>
          Retrieving bowler details...
        </p>
      </div>
    );
  }

  if (!bowler) {
    return '';
  }

  if (!commerce) {
    return '';
  }

  let displayed_name = commerce.bowler.first_name;
  if (commerce.bowler.preferred_name) {
    displayed_name = commerce.bowler.preferred_name;
  }
  const name = displayed_name + ' ' + commerce.bowler.last_name;

  let successMessage = '';
  let errorMessage = '';
  if (success) {
    successMessage = (
      <div className={'col-12 alert alert-success alert-dismissible fade show d-flex align-items-center'} role={'alert'}>
        <i className={'bi-cash-coin pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          <strong>
            Success!
          </strong>
          {' '}Your purchase was completed. Thank you for supporting our tournament!
        </div>
        <button type={'button'} className={'btn-close'} data-bs-dismiss={'alert'} aria-label={'Close'}/>
      </div>
    );
  }

  return (
    <div>
      <Row className={'pt-2'}>
        <Col md={2} className={'d-none d-md-block'}>
          <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo/>
          </a>
        </Col>
        <Col md={10} className={'d-flex flex-column justify-content-center text-center text-md-start'}>
          <h3 className={'p-0 m-0'}>
            <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
              {commerce.tournament.name}
            </a>
          </h3>
          <h4 className={'p-0 my-2 my-md-3'}>
            Bowler: {name}
          </h4>
          <p className={'p-0 m-0'}>
            <a href={`/teams/${bowler.team_identifier}`}>
              <i className={'bi-arrow-left pe-2'} aria-hidden={true}/>
              back to team
            </a>
          </p>
        </Col>
      </Row>

      <hr/>

      {successMessage}
      {errorMessage}

      <Menu/>

    </div>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout showCart={true}>
      {page}
    </RegistrationLayout>
  );
}

export default page;