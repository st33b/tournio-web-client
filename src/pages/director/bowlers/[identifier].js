import {useState} from "react";
import {useRouter} from "next/router";
import {Card, Button, Row, Col, ListGroup, Alert} from "react-bootstrap";

import {directorApiRequest, useDirectorApi} from "../../../director";
import {devConsoleLog} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import BowlerDetails from "../../../components/Director/BowlerDetails/BowlerDetails";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ManualPayment from "../../../components/Director/BowlerDetails/ManualPayment";
import OfficeUseOnly from "../../../components/Director/BowlerDetails/OfficeUseOnly";
import ResendEmailButtons from "../../../components/Director/BowlerDetails/ResendEmailButtons";
import {
  bowlerDeleted,
  bowlerUpdated
} from "../../../store/actions/directorActions";
import {useLoginContext} from "../../../store/LoginContext";

const Page = () => {
  const router = useRouter();
  const {state, dispatch} = useDirectorContext();
  const {authToken} = useLoginContext();

  let {identifier} = router.query;

  const newTeamFormInitialState = {
    destinationTeam: '',
  }
  const newPartnerFormInitialState = {
    partnerIdentifier: '',
  }
  const linkFreeEntryInitialState = {
    identifier: null,
    confirm: false,
  }

  const [newTeamFormData, setNewTeamFormData] = useState(newTeamFormInitialState);
  const [newPartnerFormData, setNewPartnerFormData] = useState(newPartnerFormInitialState);
  const [linkFreeEntryFormData, setLinkFreeEntryFormData] = useState(linkFreeEntryInitialState);

  const [deleteBowlerError, setDeleteBowlerError] = useState();

  const {loading: bowlerLoading, data: bowler, error: bowlerError} = useDirectorApi({
    uri: identifier ? `/bowlers/${identifier}` : null,
  });

  const {loading: teamsLoading, data: availableTeams, error: teamsError} = useDirectorApi({
    uri: state.tournament ? `tournaments/${state.tournament.identifier}/teams/partial=true` : null,
  });

  const {loading: unpartneredLoading, data: unpartneredBowlers, error: unpartneredError} = useDirectorApi({
    uri: state.tournament ? `/tournaments/${state.tournament.identifier}/bowlers?unpartnered=true` : null,
  });

  const {loading: freeEntriesLoading, data: availableFreeEntries, error: freeEntriesError} = useDirectorApi({
    uri: state.tournament ? `/tournaments/${state.tournament.identifier}/free_entries?unassigned=true` : null,
  });

  if (!state.tournament || bowlerLoading) {
    return <LoadingMessage message={'Retrieving bowler details...'}/>
  }

  let displayedErrors = (
    <>
      {teamsError && (
        <Alert variant={'danger'}
               dismissible={true}
               closeLabel={'Close'}>
              <span>
                <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
                <strong>Error.</strong>{' '}
                {teamsError.message}
              </span>
        </Alert>
      )}
      {unpartneredError && (
        <Alert variant={'danger'}
               dismissible={true}
               closeLabel={'Close'}>
              <span>
                <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
                <strong>Error.</strong>{' '}
                {unpartneredError.message}
              </span>
        </Alert>
      )}
      {freeEntriesError && (
        <Alert variant={'danger'}
               dismissible={true}
               closeLabel={'Close'}>
              <span>
                <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
                <strong>Error.</strong>{' '}
                {freeEntriesError.message}
              </span>
        </Alert>
      )}
    </>
  );

  const deleteBowlerSuccess = (_) => {
    dispatch(bowlerDeleted(bowler))
    router.push('/director/bowlers?success=deleted');
  }
  const deleteBowlerFailure = (data) => {
    setDeleteBowlerError(data.error);
  }

  const deleteSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm('This will remove the bowler and all their details. Are you sure?')) {
      // TODO
      // setLoading(true);
      const uri = `/bowlers/${identifier}`;
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
        authToken: authToken,
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
          {!!bowler.team && (
            <>
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
                {bowler.doubles_partner && <dd className={'col'}>{bowler.doubles_partner.full_name}</dd>}
                {!bowler.doubles_partner && <dd className={'col'}>n/a</dd>}
              </div>
            </>
          )}
          {!bowler.team && (
            <>
              <div className={'row'}>
                <dt className={'col-12 col-sm-4 col-md-5 text-sm-end'}>Team name</dt>
                <dd className={'col'}>
                  n/a
                </dd>
              </div>
              <div className={'row'}>
                <dt className={'col-12 col-sm-4 col-md-5 text-sm-end'}>Preferred Shift</dt>
                <dd className={'col'}>{bowler.shift.name}</dd>
              </div>
            </>
          )}
          <div className={'row'}>
            <dt className={'col-12 col-sm-4 col-md-5 text-sm-end'}>Fees Paid?</dt>
            <dd className={'col'}>{bowler.paid ? 'Yes' : 'No'}</dd>
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
        {deleteBowlerError && (
          <Alert variant={'danger'}
                 dismissible={true}
                 closeLabel={'Close'}>
              <span>
                <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
                <strong>Error.</strong>{' '}
                {deleteBowlerError}
              </span>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );

  const moveBowlerOptionChanged = (event) => {
    const newFormData = {...newTeamFormData}
    newFormData.destinationTeam = event.target.value;
    setNewTeamFormData(newFormData);
  }

  const moveBowlerSuccess = (data) => {
    // TODO: reload page
  }

  const moveBowlerFailure = (data) => {
    // TODO: specific error message
    // setErrorMessage(data.error);
  }

  const bowlerMoveSubmitHandler = (event) => {
    event.preventDefault();
    const uri = `/bowlers/${identifier}`;
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
      authToken: authToken,
      onSuccess: moveBowlerSuccess,
      onFailure: moveBowlerFailure,
    });
  }

  let moveToTeamCard = '';
  if (availableTeams.length > 0) {
    let bowlerTeamId = '';
    if (bowler.team) {
      bowlerTeamId = bowler.team.identifier;
    }
    const options = availableTeams.filter(t => t.identifier !== bowlerTeamId);

    moveToTeamCard = (
      <Card className={'mb-3'}>
        <Card.Header as={'h6'} className={'fw-light'}>
          Move to another team
        </Card.Header>
        <Card.Body>
          <form className={'text-center'} onSubmit={bowlerMoveSubmitHandler}>
            <select className={'form-select'} name={'destinationTeam'} onChange={moveBowlerOptionChanged}>
              <option value={''}>Choose their new team</option>
              {options.map(t => <option key={t.identifier} value={t.identifier}>{t.name}</option>)}
            </select>
            <Button variant={'primary'}
                    size={'sm'}
                    className={'mt-3'}
                    disabled={newTeamFormData.destinationTeam === ''}
                    type={'submit'}>
              Move Bowler
            </Button>
          </form>
        {/* TODO: put error message here */}
        </Card.Body>
      </Card>
    );
  }

  const partnerOptionChanged = (event) => {
    const newFormData = {...newPartnerFormData}
    newFormData.partnerIdentifier = event.target.value;
    setNewPartnerFormData(newFormData);
  }

  const newPartnerSuccess = (data) => {
    // TODO: reload page
  }
  const newPartnerFailure = (data) => {
    // TODO: specific error message
    // setErrorMessage(data.error);
  }

  const newPartnerSubmitHandler = (event) => {
    event.preventDefault();
    const uri = `/bowlers/${identifier}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler: {
          doubles_partner: {
            identifier: newPartnerFormData.partnerIdentifier,
          }
        }
      }
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: newPartnerSuccess,
      onFailure: newPartnerFailure,
    });
  }

  let assignPartnerCard = '';
  const tournamentHasDoublesEvent = ['active', 'closed'].includes(state.tournament.state) && state.tournament.purchasable_items.bowling.some(pi => {
    return pi.determination === 'event' && pi.refinement === 'doubles'
  });
  if (tournamentHasDoublesEvent && unpartneredBowlers.length > 0) {
    let bowlerPartnerId = '';
    if (bowler.doubles_partner) {
      bowlerPartnerId = bowler.doubles_partner.identifier;
    }
    const options = unpartneredBowlers.filter(t => t.identifier !== bowlerPartnerId);

    assignPartnerCard = (
      <Card className={'mb-3'}>
        <Card.Header as={'h6'} className={'fw-light'}>
          Assign Doubles Partner
        </Card.Header>
        <Card.Body>
          <form className={'text-center'} onSubmit={newPartnerSubmitHandler}>
            <select className={'form-select'} name={'partner'} onChange={partnerOptionChanged}>
              <option value={''}>Choose their new partner</option>
              {options.map(t => <option key={t.identifier} value={t.identifier}>{t.full_name}</option>)}
            </select>
            <Button variant={'primary'}
                    size={'sm'}
                    className={'mt-3'}
                    disabled={newPartnerFormData.partner === ''}
                    type={'submit'}>
              Assign Partner
            </Button>
          </form>
        {/* TODO: put error message here */}
        </Card.Body>
      </Card>
    );
  }

  const linkFreeEntryOptionChanged = (event) => {
    const newFormData = {...linkFreeEntryFormData}
    newFormData.identifier = event.target.value;
    setLinkFreeEntryFormData(newFormData);
  }

  const confirmFreeEntryChanged = (event) => {
    const newFormData = {...linkFreeEntryFormData}
    newFormData.confirm = event.target.checked;
    setLinkFreeEntryFormData(newFormData);
  }

  const linkFreeEntrySuccess = (data) => {
    // TODO: can we trigger a re-render rather than a reload?
    router.reload();
  }
  const linkFreeEntryFailure = (data) => {
    // TODO: specific error message
    // setErrorMessage('Failed to link the free entry.');
  }

  const linkFreeEntrySubmitHandler = (event) => {
    event.preventDefault();

    const uri = `/free_entries/${linkFreeEntryFormData.identifier}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler_identifier: identifier,
        confirm: linkFreeEntryFormData.confirm,
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: linkFreeEntrySuccess,
      onFailure: linkFreeEntryFailure,
    });
  }

  let linkFreeEntryCard = '';
  if (!bowler.free_entry && availableFreeEntries.length > 0) {
    linkFreeEntryCard = (
      <Card className={'mb-3'}>
        <Card.Header as={'h6'} className={'fw-light'}>
          Link a Free Entry
        </Card.Header>
        <Card.Body>
          <form onSubmit={linkFreeEntrySubmitHandler}>
            <select className={'form-select'} name={'destinationTeam'} onChange={linkFreeEntryOptionChanged}>
              <option value={''}>Choose a free entry code</option>
              {availableFreeEntries.map(fe => <option key={fe.identifier}
                                                      value={fe.identifier}>{fe.unique_code}</option>)}
            </select>
            <div className={'form-check pt-3'}>
              <input className={'form-check-input'}
                     type={'checkbox'}
                     value={'1'}
                     onChange={confirmFreeEntryChanged}
                     id={'confirm'}/>
              <label className={'form-check-label'} htmlFor={'confirm'}>
                Confirm it, too.
              </label>
            </div>
            <div className={'text-center'}>
              <Button variant={'primary'}
                      size={'sm'}
                      className={'mt-3'}
                      disabled={linkFreeEntryFormData.identifier === null}
                      type={'submit'}>
                Link Free Entry
              </Button>
            </div>
          </form>
        {/* TODO: error message here */}
        </Card.Body>
      </Card>
    );
  }

  const purchases = (
    <Card className={'mb-3'}>
      <Card.Header as={'h6'} className={'fw-light'}>
        Purchases
      </Card.Header>
      <ListGroup variant={'flush'}>
        {bowler.purchases && bowler.purchases.map(p => {
          return (
            <ListGroup.Item key={p.identifier}>
              <span className={`float-end ${p.voided_at ? 'text-decoration-line-through' : ''}`}>
                ${p.amount}
              </span>
              <span className={'d-block'}>
                {p.name}
              </span>
              {p.paid_at && (
                <small className={'d-block fst-italic'}>
                  <strong>
                    Paid:{' '}
                  </strong>
                  {p.paid_at}
                </small>
              )}
              {p.voided_at && (
                <small className={'d-block fst-italic'}>
                  <strong>
                    Voided:{' '}
                  </strong>
                  {p.voided_at}
                </small>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );

  const ledgerEntryAdded = (newEntry) => {
    const newBowler = {...bowler};
    newBowler.ledger_entries = bowler.ledger_entries.concat(newEntry);
    newBowler.amount_due = 0;
    // TODO: reload? re-render? Looks like this wants to update the bowler in context...
    // setBowler(newBowler);
    dispatch(bowlerUpdated(newBowler));
  }

  const ledgerEntries = (
    <Card className={'mb-3'}>
      <Card.Header as={'h6'} className={'fw-light'}>
        Ledger Entries
      </Card.Header>
      <ListGroup variant={'flush'}>
        {bowler.ledger_entries && bowler.ledger_entries.map((l, i) => {
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
        <ListGroup.Item className={'p-0'}>
          {/* TODO: update ManualPayment component not to use director context. (Maybe not to make an API call at all)*/}
          <ManualPayment bowler={bowler} added={ledgerEntryAdded}/>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );

  const convertBowlerDataForPatch = (bowlerData) => {
    return {
      person_attributes: {
        first_name: bowlerData.first_name,
        last_name: bowlerData.last_name,
        usbc_id: bowlerData.usbc_id,
        // igbo_id: bowlerData.igbo_id,
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
    state.tournament.additional_questions.forEach(aq => {
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
    const uri = `/bowlers/${identifier}`;
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
      authToken: authToken,
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
    {text: state.tournament.name, path: `/director/tournaments/${state.tournament.identifier}`},
    {text: 'Bowlers', path: `/director/bowlers`},
  ];

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={bowlerName}/>
      <Row>
        <Col md={8}>
          {bowlerError && (
            <Alert variant={'danger'}
                   dismissible={true}
                   closeLabel={'Close'}>
              <span>
                <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
                <strong>Error.</strong>{' '}
                {bowlerError.message}
              </span>
            </Alert>
          )}
          {bowlerSummary}
          <BowlerDetails tournament={state.tournament}
                         bowler={bowler}
                         bowlerUpdateSubmitted={updateSubmitHandler}
          />
        </Col>
        <Col md={4}>
          <OfficeUseOnly bowler={bowler}/>
          <ResendEmailButtons bowler={bowler}/>
          {linkFreeEntryCard}
          {moveToTeamCard}
          {assignPartnerCard}
          {bowler.purchases && bowler.purchases.length > 0 && purchases}
          {ledgerEntries}
          <hr/>
          {deleteBowlerCard}
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
