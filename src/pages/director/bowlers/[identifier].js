import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Card, Button, Row, Col, ListGroup} from "react-bootstrap";

import {directorApiRequest} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import BowlerDetails from "../../../components/Director/BowlerDetails/BowlerDetails";

const page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();

  let {identifier} = router.query;

  if (!directorContext) {
    return '';
  }

  const [bowler, setBowler] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const newTeamFormInitialState = {
    destinationTeam: '',
  }
  const [newTeamFormData, setNewTeamFormData] = useState(newTeamFormInitialState);

  // This effect ensures that we're logged in and have permission to administer the current tournament
  useEffect(() => {
    if (!directorContext || !directorContext.tournament || !directorContext.user) {
      return;
    }
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
    const tournament = directorContext.tournament;
    // if the logged-in user is a director but not for this tournament...
    if (directorContext.user.role === 'director' && !directorContext.user.tournaments.some(t => t.identifier === tournament.identifier)) {
      router.push('/director');
    }
  }, [directorContext]);

  const fetchBowlerSuccess = (data) => {
    setLoading(false);
    setBowler(data);
  }

  const fetchBowlerFailure = (data) => {
    setErrorMessage(data.error);
    setLoading(false);
  }

  // This effect pulls the bowler details from the backend
  useEffect(() => {
    if (!identifier || !directorContext || !directorContext.token) {
      return;
    }

    const uri = `/director/bowlers/${identifier}`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: fetchBowlerSuccess,
      onFailure: fetchBowlerFailure,
    });
  }, [identifier, directorContext]);

  const fetchTeamsSuccess = (data) => {
    setLoading(false);
    setAvailableTeams(data);
  }

  const fetchTeamsFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  // This effect retrieves the list of teams available to join
  useEffect(() => {
    if (!directorContext || !directorContext.tournament || !directorContext.token) {
      return;
    }

    const uri = `/director/tournaments/${directorContext.tournament.identifier}/teams?partial=true`;
    const requestConfig = {
      method: 'get',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: fetchTeamsSuccess,
      onFailure: fetchTeamsFailure,
    });
  }, [directorContext]);

  if (loading) {
    return <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>;
  }

  if (errorMessage) {
    return (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'}
           role={'alert'}>
        <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          <strong>
            Oh no!
          </strong>
          {' '}{errorMessage}
        </div>
      </div>
    );
  }

  if (!bowler) {
    return (
      <div className={'display-6 text-center'}>
        Retrieving bowler details...
      </div>
    );
  }

  const deleteBowlerSuccess = (_) => {
    setLoading(false);
    router.push('/director/bowlers?success=deleted');
  }

  const deleteBowlerFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  const deleteSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm('This will remove the bowler and all their details. Are you sure?')) {
      setLoading(true);
      const uri = `/director/bowlers/${identifier}`;
      const requestConfig = {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      setLoading(true);
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        context: directorContext,
        router: router,
        onSuccess: deleteBowlerSuccess,
        onFailure: deleteBowlerFailure,
      });
    }
  }

  const bowlerSummary = (
    <Card className={'mb-2'}>
      <Card.Header as={'h3'}>
        {bowler.display_name}
      </Card.Header>
      <Card.Body>
        <dl className={'mb-0'}>
          <div className={'row'}>
            <dt className={'col-12 col-sm-4 col-md-5 text-sm-end'}>Team name</dt>
            <dd className={'col'}>
              <a href={`/director/teams/${bowler.team.identifier}`}>
                {bowler.team.name}
              </a>
            </dd>
          </div>
          <div className={'row'}>
            <dt className={'col-12 col-sm-4 col-md-5 text-sm-end'}>Team position</dt>
            <dd className={'col'}>{bowler.position}</dd>
          </div>
          <div className={'row'}>
            <dt className={'col-12 col-sm-4 col-md-5 text-sm-end'}>Doubles partner</dt>
            <dd className={'col'}>{bowler.doubles_partner}</dd>
          </div>
        </dl>
      </Card.Body>
    </Card>
  );

  const deleteBowlerCard = (
    <Card className={'mb-3'}>
      <Card.Body className={'text-center'}>
        <form onSubmit={deleteSubmitHandler}>
          <Button variant={'danger'}
                  type={'submit'}
          >
            Delete Bowler
          </Button>
        </form>
      </Card.Body>
    </Card>
  );

  const moveBowlerOptionChanged = (event) => {
    const newFormData = {...newTeamFormData}
    newFormData.destinationTeam = event.target.value;
    setNewTeamFormData(newFormData);
  }

  const moveBowlerSuccess = (data) => {
    setLoading(false);
    setBowler(data);
  }

  const moveBowlerFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  const bowlerMoveSubmitHandler = (event) => {
    event.preventDefault();
    const uri = `/director/bowlers/${identifier}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler: {
          team: {
            identifier: newTeamFormData.destinationTeam,
          }
        }
      }
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: moveBowlerSuccess,
      onFailure: moveBowlerFailure,
    });
  }

  let moveToTeamCard = (
    <Card className={'mb-3'}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Move to another team
      </Card.Header>
      <Card.Body>
        No partial teams available.
      </Card.Body>
    </Card>
  );
  if (availableTeams.length > 0) {
    const bowlerTeamId = bowler.team.identifier;
    const options = availableTeams.filter(t => t.identifier !== bowlerTeamId);

    moveToTeamCard = (
      <Card className={'mb-3'}>
        <Card.Header as={'h5'} className={'fw-light'}>
          Move to another team
        </Card.Header>
        <Card.Body>
          <form className={'text-center'} onSubmit={bowlerMoveSubmitHandler}>
            <select className={'form-select'} name={'destinationTeam'} onChange={moveBowlerOptionChanged}>
              <option value={''}>Choose their new team</option>
              {options.map(t => <option key={t.identifier} value={t.identifier}>{t.name}</option>)}
            </select>
            <Button variant={'primary'}
                    className={'mt-3'}
                    disabled={newTeamFormData.destinationTeam === ''}
                    type={'submit'}>
              Move Bowler
            </Button>
          </form>
        </Card.Body>
      </Card>
    );
  }

  const purchases = (
    <Card className={'mb-3'}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Purchases
      </Card.Header>
      <ListGroup variant={'flush'}>
        {bowler.purchases.map(p => {
          return (
            <ListGroup.Item key={p.identifier}>
              <span className={'float-end'}>
                ${p.amount}
              </span>
              <span className={'d-block'}>
                {p.name}
              </span>
              <small className={'d-block fst-italic'}>
                {p.paid_at}
              </small>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );

  const ledgerEntries = (
    <Card className={'mb-3'}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Ledger Entries
      </Card.Header>
      <ListGroup variant={'flush'}>
        {bowler.ledger_entries.map((l, i) => {
          const amountClass = l.credit > 0 ? 'text-success' : 'text-danger';
          const amount = l.credit - l.debit;
          return (
            <ListGroup.Item key={`${l.identifier}-${i}`}>
              <span className={`${amountClass} float-end`}>
                ${amount}
              </span>
              <span className={'d-block'}>
                {l.identifier}
              </span>
              <small className={'d-block fst-italic'}>
                {l.created_at}
              </small>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );

  const convertBowlerDataForPatch = (bowlerData) => {
    return {
      person_attributes: {
        first_name: bowlerData.first_name,
        last_name: bowlerData.last_name,
        usbc_id: bowlerData.usbc_id,
        igbo_id: bowlerData.igbo_id,
        birth_month: bowlerData.birth_month,
        birth_day: bowlerData.birth_day,
        nickname: bowlerData.nickname,
        phone: bowlerData.phone,
        email: bowlerData.email,
        address1: bowlerData.address1,
        address2: bowlerData.address2,
        city: bowlerData.city,
        state: bowlerData.state,
        country: bowlerData.country,
        postal_code: bowlerData.postal_code,
      },
      additional_question_responses: convertAdditionalQuestionResponsesForPatch(bowlerData),
    };
  }

  const convertAdditionalQuestionResponsesForPatch = (bowlerData) => {
    const responses = [];
    directorContext.tournament.additional_questions.forEach(aq => {
      const key = aq.name;
      responses.push({
        name: key,
        response: bowlerData[key] || '',
      });
    });
    return responses;
  }

  const bowlerUpdateSuccess = (data) => {
    setLoading(false);
    setBowler(data);
  }

  const bowlerUpdateFailure = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  const updateSubmitHandler = (bowlerData) => {
    const uri = `/director/bowlers/${identifier}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler: convertBowlerDataForPatch(bowlerData),
      },
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: directorContext,
      router: router,
      onSuccess: bowlerUpdateSuccess,
      onFailure: bowlerUpdateFailure,
    });
  }

  let bowlerName = '';
  if (bowler) {
    bowlerName = bowler.display_name;
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: directorContext.tournament.name, path: `/director/tournaments/${directorContext.tournament.identifier}`},
    {text: 'Bowlers', path: `/director/bowlers`},
  ];

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={bowlerName}/>
      <Row>
        <Col md={8}>
          {/*<h3>*/}
          {/*  {bowlerName}*/}
          {/*</h3>*/}
          {bowlerSummary}
          <BowlerDetails bowler={bowler}
                         bowlerUpdateSubmitted={updateSubmitHandler}
          />
          <Row>
            <Col md={6}>
              {deleteBowlerCard}
            </Col>
            <Col md={6}>
              {moveToTeamCard}
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          {purchases}
          {ledgerEntries}
        </Col>
      </Row>
    </div>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default page;