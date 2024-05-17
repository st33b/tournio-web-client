import React, {useState} from "react";
import {useRouter} from "next/router";
import Link from 'next/link';
import {Card, Button, Row, Col, ListGroup, Alert} from "react-bootstrap";

import {directorApiRequest, useDirectorApi, useModernTournament} from "../../../../../director";
import DirectorLayout from "../../../../../components/Layout/DirectorLayout/DirectorLayout";
import Breadcrumbs from "../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import ManualPayment from "../../../../../components/Director/BowlerDetails/ManualPayment";
import OfficeUseOnly from "../../../../../components/Director/BowlerDetails/OfficeUseOnly";
import {useLoginContext} from "../../../../../store/LoginContext";
import ErrorBoundary from "../../../../../components/common/ErrorBoundary";
import SuccessAlert from "../../../../../components/common/SuccessAlert";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import EmailButton from "../../../../../components/Director/BowlerDetails/EmailButton";
import {updateObject} from "../../../../../utils";
import BowlerForm from "../../../../../components/Registration/BowlerForm/BowlerForm";

const BowlerPage = () => {
  const router = useRouter();
  const {authToken} = useLoginContext();

  const {identifier, bowlerId} = router.query;

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

  const [success, setSuccess] = useState({
    deleteBowler: null,
    moveBowler: null,
    unpartneredBowlers: null,
    freeEntries: null,
    updateBowler: null,
    addLedgerEntry: null,
    setTournamentData: null,
    waiveFee: null,
  })
  const [errors, setErrors] = useState({
    deleteBowler: null,
    moveBowler: null,
    unpartneredBowlers: null,
    freeEntries: null,
    updateBowler: null,
    addLedgerEntry: null,
    setTournamentData: null,
    waiveFee: null,
  });
  const [loadingParts, setLoadingParts] = useState({
    deleteBowler: false,
    moveBowler: false,
    unpartneredBowlers: false,
    freeEntries: false,
    updateBowler: false,
    addLedgerEntry: false,
    setTournamentData: false,
    waiveFee: false,
  });

  const updateStateForBowler = (data) => {
    if (data.free_entry) {
      const newFreeEntryForm = {...linkFreeEntryFormData};
      newFreeEntryForm.identifier = data.free_entry.identifier;
      newFreeEntryForm.confirm = data.free_entry.confirmed;
      setLinkFreeEntryFormData(newFreeEntryForm);
    }

    // any other state data the bowler needs...
  }

  const {tournament, tournamentUpdatedQuietly} = useModernTournament();

  const {loading: bowlerLoading, data: bowler, error: bowlerError, onDataUpdate: onBowlerUpdate} = useDirectorApi({
    uri: bowlerId ? `/bowlers/${bowlerId}` : null,
    onSuccess: updateStateForBowler,
  });

  const {data: availableTeams, error: teamsError, onDataUpdate: onAvailableTeamsUpdate} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/teams?partial=true` : null,
    initialData: [],
    onSuccess: () => {
      setLoadingParts({
        ...loadingParts,
        moveBowler: false,
      });
    },
    onFailure: () => {
      setLoadingParts({
        ...loadingParts,
        moveBowler: false,
      });
      setErrors({
        ...errors,
        moveBowler: 'Failed to load list',
      });
    },
  });

  const {data: unpartneredBowlers, error: unpartneredError, onDataUpdate: onDoublesPartnerUpdate} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/bowlers?unpartnered=true` : null,
    initialData: [],
    onSuccess: () => {
      setLoadingParts({
        ...loadingParts,
        unpartneredBowlers: false,
      });
    },
    onFailure: () => {
      setLoadingParts({
        ...loadingParts,
        unpartneredBowlers: false,
      });
      setErrors({
        ...errors,
        unpartneredBowlers: 'Failed to load list',
      });
    },
  });

  const {data: availableFreeEntries, error: freeEntriesError, onDataUpdate: onFreeEntryUpdate} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/free_entries?unassigned=true` : null,
    initialData: [],
    onSuccess: () => {
      setLoadingParts({
        ...loadingParts,
        freeEntries: false,
      });
    },
    onFailure: () => {
      setLoadingParts({
        ...loadingParts,
        freeEntries: false,
      });
      setErrors({
        ...errors,
        freeEntries: 'Failed to load list',
      });
    },
  });

  const deleteBowlerSuccess = (_) => {
    const modifiedTournament = updateObject(tournament, {
      bowlerCount: tournament.bowlerCount.length - 1,
    });
    tournamentUpdatedQuietly(modifiedTournament);
    router.push(`/director/tournaments/${identifier}/bowlers?deleteSuccess=true`);
  }
  const deleteBowlerFailure = (data) => {
    setLoadingParts({
      ...loadingParts,
      deleteBowler: false,
    });
    setErrors({
      ...errors,
      deleteBowler: data.error,
    });
  }

  const deleteSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm('This will remove the bowler and all their details. Are you sure?')) {
      setLoadingParts({
        ...loadingParts,
        deleteBowler: true,
      });
      const uri = `/bowlers/${bowlerId}`;
      const requestConfig = {
        method: 'delete',
      }
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        authToken: authToken,
        onSuccess: deleteBowlerSuccess,
        onFailure: deleteBowlerFailure,
      });
    }
  }

  const moveBowlerOptionChanged = (event) => {
    const newFormData = {...newTeamFormData}
    newFormData.destinationTeam = event.target.value;
    setNewTeamFormData(newFormData);
  }

  const moveBowlerSuccess = (data) => {
    setLoadingParts({
      ...loadingParts,
      moveBowler: false,
    });

    // This triggers a re-fetch of the bowler and then a re-render of the bowler summary,
    // but not the other objects populated by calls to the useDirectorApi hook.
    onBowlerUpdate(data);

    // retrieve the new list of available teams
    onAvailableTeamsUpdate(availableTeams);

    setSuccess({
      ...success,
      moveBowler: 'Bowler moved to new team.',
    });
  }

  const moveBowlerFailure = (data) => {
    setLoadingParts({
      ...loadingParts,
      moveBowler: false,
    });
    setErrors({
      ...errors,
      moveBowler: data.error,
    });
  }

  const bowlerMoveSubmitHandler = (event) => {
    event.preventDefault();
    const uri = `/bowlers/${bowlerId}`;
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
    setLoadingParts({
      ...loadingParts,
      moveBowler: true,
    });
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: moveBowlerSuccess,
      onFailure: moveBowlerFailure,
    });
  }

  const partnerOptionChanged = (event) => {
    const newFormData = {...newPartnerFormData}
    newFormData.partnerIdentifier = event.target.value;
    setNewPartnerFormData(newFormData);
  }

  const newPartnerSuccess = (data) => {
    setLoadingParts({
      ...loadingParts,
      unpartneredBowlers: false,
    });

    // This triggers a re-fetch of the bowler and then a re-render of the bowler summary,
    // but not the other objects populated by calls to the useDirectorApi hook.
    onBowlerUpdate(data);

    // retrieve the new list of unpartnered bowlers
    onDoublesPartnerUpdate(unpartneredBowlers);

    setSuccess({
      ...success,
      unpartneredBowlers: 'Doubles partner updated.',
    });
  }
  const newPartnerFailure = (data) => {
    setLoadingParts({
      ...loadingParts,
      unpartneredBowlers: false,
    });
    setErrors({
      ...errors,
      unpartneredBowlers: data.error,
    });
  }

  const newPartnerSubmitHandler = (event) => {
    event.preventDefault();
    const uri = `/bowlers/${bowlerId}`;
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
    setLoadingParts({
      ...loadingParts,
      unpartneredBowlers: true,
    });
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: newPartnerSuccess,
      onFailure: newPartnerFailure,
    });
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
    setLoadingParts({
      ...loadingParts,
      freeEntries: false,
    });

    onFreeEntryUpdate(data);

    // This updates the bowler's ledger entries, so we should also refresh the bowler
    onBowlerUpdate(bowler);

    setSuccess({
      ...success,
      freeEntries: 'Free entry saved.',
    });
  }
  const linkFreeEntryFailure = (error) => {
    setLoadingParts({
      ...loadingParts,
      freeEntries: false,
    });
    setErrors({
      ...errors,
      freeEntries: error.message,
    });
  }

  // Updating with true is a confirmation -- so include the bowler identifier
  // (necessary if we're linking and confirming in one fell swoop)
  //
  // Updating with false is a denial -- so force the bowler_identifier to null
  // (this will unlink an entry that's already linked but unconfirmed)
  const updateFreeEntry = (isConfirmed, bowlerIdentifier=null) => {
    const uri = `/free_entries/${linkFreeEntryFormData.identifier}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        confirm: !!isConfirmed,
        bowler_identifier: bowlerIdentifier,
      },
    }
    setLoadingParts({
      ...loadingParts,
      freeEntries: true,
    })
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: linkFreeEntrySuccess,
      onFailure: linkFreeEntryFailure,
    });
  }

  const linkFreeEntrySubmitHandler = (event) => {
    event.preventDefault();
    updateFreeEntry(linkFreeEntryFormData.confirm, bowlerId);
  }

  const confirmFreeEntryClicked = (event) => {
    event.preventDefault();
    updateFreeEntry(true, bowlerId);
  }

  const denyFreeEntryClicked = (event) => {
    event.preventDefault();
    updateFreeEntry(false);
  }

  const convertBowlerDataForPatch = (bowlerData) => {
    return {
      person_attributes: {
        first_name: bowlerData.first_name,
        last_name: bowlerData.last_name,
        usbc_id: bowlerData.usbc_id,
        birth_month: bowlerData.birth_month,
        birth_day: bowlerData.birth_day,
        birth_year: bowlerData.birth_year,
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
    for (const questionKey in tournament.additional_questions) {
      responses.push({
        name: questionKey,
        response: bowlerData[questionKey] || '',
      });
    }
    return responses;
  }

  const bowlerUpdateSuccess = (data) => {
    setLoadingParts({
      ...loadingParts,
      updateBowler: false,
    });
    onBowlerUpdate(data);
    setSuccess({
      ...success,
      updateBowler: 'Bowler details updated.',
    });
  }
  const bowlerUpdateFailure = (message) => {
    setLoadingParts({
      ...loadingParts,
      updateBowler: false,
    });
    setErrors({
      ...errors,
      updateBowler: message,
    });
  }

  const updateSubmitHandler = (bowlerData) => {
    const uri = `/bowlers/${bowlerId}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler: convertBowlerDataForPatch(bowlerData),
      },
    }
    setLoadingParts({
      ...loadingParts,
      updateBowler: true,
    });
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: bowlerUpdateSuccess,
      onFailure: bowlerUpdateFailure,
    });
  }

  const addLedgerEntrySuccess = (newEntry) => {
    setLoadingParts({
      ...loadingParts,
      addLedgerEntry: false,
    });
    setSuccess({
      ...success,
      addLedgerEntry: 'Manual payment added',
    });

    const newBowler = {...bowler};
    newBowler.ledger_entries = bowler.ledger_entries.concat(newEntry);
    newBowler.amount_due = 0;
    onBowlerUpdate(newBowler);
  }

  const addLedgerEntryFailure = (error) => {
    setLoadingParts({
      ...loadingParts,
      addLedgerEntry: false,
    });
    setErrors({
      ...errors,
      addLedgerEntry: error,
    });
  }

  const ledgerEntrySubmitted = (data, onSuccess = () => {
  }, onFailure = () => {
  }) => {
    setLoadingParts({
      ...loadingParts,
      addLedgerEntry: true,
    });
    const uri = `/bowlers/${bowlerId}/ledger_entries`;
    const requestConfig = {
      method: 'post',
      data: {
        ledger_entry: data,
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => {
        addLedgerEntrySuccess(data);
        onSuccess();
      },
      onFailure: (error) => {
        addLedgerEntryFailure(error);
        onFailure();
      },
    });
  }

  const submitTournamentDataSuccess = (data) => {
    setLoadingParts({
      ...loadingParts,
      setTournamentData: false,
    });
    onBowlerUpdate(data);
    setSuccess({
      ...success,
      setTournamentData: 'Data saved.',
    });
  }

  const submitTournamentDataFailure = (error) => {
    setLoadingParts({
      ...loadingParts,
      setTournamentData: false,
    });
    setErrors({
      ...errors,
      setTournamentData: error,
    });
  }

  const tournamentDataSubmitted = (data, onSuccess = () => {
  }, onFailure = () => {
  }) => {
    setLoadingParts({
      ...loadingParts,
      setTournamentData: true,
    });
    const uri = `/bowlers/${bowlerId}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler: {
          verified_data: data,
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => {
        submitTournamentDataSuccess(data);
        onSuccess();
      },
      onFailure: (error) => {
        submitTournamentDataFailure(error);
        onFailure();
      },
    });
  }

  const resendEmailButtonClicked = ({
                                      data,
                                      onSuccess = () => {
                                      },
                                      onFailure = () => {
                                      },
                                    }) => {
    const uri = `/bowlers/${bowlerId}/resend_email`;
    const requestConfig = {
      method: 'post',
      data: data
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: onSuccess,
      onFailure: onFailure,
    })
  }

  const dismissSuccessAlert = (which) => {
    setSuccess({
      ...success,
      [which]: null,
    })
  }

  const dismissErrorAlert = (which) => {
    setErrors({
      ...errors,
      [which]: null,
    })
  }

  const waiveFeeSuccess = (newWaiver) => {
    setLoadingParts({
      ...loadingParts,
      waiveFee: false,
    });
    setSuccess({
      ...success,
      waiveFee: 'Late fee waived',
    });

    const newBowler = {...bowler};
    newBowler.waivers = [newWaiver];
    onBowlerUpdate(newBowler);
  }

  const waiveFeeFailure = (error) => {
    setLoadingParts({
      ...loadingParts,
      waiveFee: false,
    });
    setErrors({
      ...errors,
      waiveFee: error,
    });
  }

  const waiveClicked = (event) => {
    event.preventDefault();
    if (confirm('Confirm: waive late fee for this bowler')) {
      const uri = `/bowlers/${bowlerId}/waivers`;
      const requestConfig = {
        method: 'post',
      }
      setLoadingParts({
        ...loadingParts,
        waiveFee: true,
      });
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        authToken: authToken,
        onSuccess: waiveFeeSuccess,
        onFailure: waiveFeeFailure,
      });
    }
  }
  //////////////////////////////////////////////////////////////////////

  if (bowlerLoading || !tournament || !bowler) {
    return <LoadingMessage message={'Retrieving bowler details...'}/>
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
                  <Link href={{
                    pathname: '/director/tournaments/[identifier]/teams/[teamId]',
                    query: {
                      identifier: identifier,
                      teamId: bowler.team.identifier,
                  }}}
                  >
                    {bowler.team.name}
                  </Link>
                </dd>
              </div>
              <div className={'row'}>
                <dt className={'col-12 col-sm-4 col-md-5 text-sm-end'}>Team position</dt>
                <dd className={'col'}>{bowler.position}</dd>
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
            </>
          )}
          <div className={'row'}>
            <dt className={'col-12 col-sm-4 col-md-5 text-sm-end'}>Doubles partner</dt>
            {bowler.doubles_partner && <dd className={'col'}>{bowler.doubles_partner.full_name}</dd>}
            {!bowler.doubles_partner && <dd className={'col'}>n/a</dd>}
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
        {errors.deleteBowler && (
          <Alert variant={'danger'}
                 dismissible={true}
                 closeLabel={'Close'}>
              <span>
                <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true}/>
                <strong>Error.</strong>{' '}
                {errors.deleteBowler}
              </span>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );

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
                    disabled={loadingParts.moveBowler || newTeamFormData.destinationTeam === ''}
                    type={'submit'}>
              {loadingParts.moveBowler && (
                <span>
                  <span className={'spinner-border spinner-border-sm me-2'} role={'status'} aria-hidden={true}></span>
                </span>
              )}
              Move Bowler
            </Button>
          </form>
          <SuccessAlert message={success.moveBowler}
                        className={'mt-3 mb-0'}
                        onClose={() => dismissSuccessAlert('moveBowler')}
          />
          <ErrorAlert message={teamsError}
                      className={'mt-3 mb-0'}
                      onClose={() => dismissErrorAlert('moveBowler')}
          />
          <ErrorAlert message={errors.moveBowler}
                      className={'mt-3 mb-0'}
                      onClose={() => dismissErrorAlert('moveBowler')}
          />
        </Card.Body>
      </Card>
    );
  }

  // In non-standard tournaments, or tournaments where doubles is the only event, permit partner reassignment.
  let assignPartnerCard = '';
  const tournamentType = tournament.config['tournament_type'];
  if (tournamentType === 'single_event' || tournamentType === 'igbo_non_standard') {
    const tournamentHasDoublesEvent = ['testing', 'active', 'demo'].includes(tournament.state) &&
      tournament.events.some(({rosterType}) => rosterType === 'double'
      );
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
            {errors.unpartneredBowlers || unpartneredError && (
              <Alert variant={'danger'}
                     dismissible={true}
                     closeLabel={'Close'}>
              <span>
                <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true}/>
                <strong>Error.</strong>{' '}
                {errors.unpartneredBowlers}
                {unpartneredError.message}
              </span>
              </Alert>
            )}
          </Card.Body>
        </Card>
      );
    }
  }

  let freeEntryCard = '';
  if (bowler.free_entry || availableFreeEntries.length > 0) {
    freeEntryCard = (
      <Card className={'mb-3'}>
        <Card.Header as={'h6'} className={'fw-light'}>
          Free Entry
        </Card.Header>
        <Card.Body>
          {bowler.free_entry && bowler.free_entry.confirmed && (
            <div className={`text-center`}>
              <span className={`font-monospace me-2`}>
                {bowler.free_entry.unique_code}
              </span>
              (confirmed)
            </div>
          )}
          {bowler.free_entry && !bowler.free_entry.confirmed && (
            <div className={`d-flex justify-content-end align-items-center`}>
              <span className={`font-monospace me-auto`}>
                {bowler.free_entry.unique_code}
              </span>
              <Button variant={'outline-danger'}
                      size={'sm'}
                      className={'me-3'}
                      onClick={denyFreeEntryClicked}>
                Deny
              </Button>
              <Button variant={'outline-success'}
                      size={'sm'}
                      onClick={confirmFreeEntryClicked}>
                Confirm
              </Button>
            </div>
          )}
          {!bowler.free_entry && (
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
          )}
          <SuccessAlert message={success.freeEntries}
                        className={'mt-3 mb-0'}
                        onClose={() => dismissSuccessAlert('freeEntries')}/>
          <ErrorAlert message={errors.freeEntries}
                      className={`mt-3 mb-0`}
                      onClose={() => dismissErrorAlert('freeEntries')}/>
          {freeEntriesError && (
            <ErrorAlert message={freeEntriesError.message}
                        className={`mt-3 mb-0`}
                        onClose={() => dismissErrorAlert('freeEntries')}/>
          )}
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
                {p.determination === 'early_discount' ? '–' : ''}
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

  const ledgerEntries = (
    <Card className={'mb-3'}>
      <Card.Header as={'h6'} className={'fw-light'}>
        Ledger Entries
      </Card.Header>
      <ListGroup variant={'flush'}>
        {bowler.ledger_entries && bowler.ledger_entries.map((l, i) => {
          const amountClass = l.credit > 0 ? 'text-success' : 'text-danger';
          const amount = l.credit || l.debit;
          return (
            <ListGroup.Item key={`${l.identifier}-${i}`}>
              <span className={`${amountClass} float-end`}>
                {!!l.debit ? '–' : ''}
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
          <ManualPayment bowler={bowler}
                         onSubmit={ledgerEntrySubmitted}
                         loading={loadingParts.addLedgerEntry}/>
          <SuccessAlert message={success.addLedgerEntry} className={'mx-3 mt-3'}/>
          <ErrorAlert message={errors.addLedgerEntry} className={'mx-3 mt-3'}/>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );

  const waivers = !tournament.purchasableItems.some(({determination}) => determination === 'late_fee') ? '' : (
    <Card className={'mb-3'}>
      <Card.Header as={'h6'} className={'fw-light'}>
        Fee Waivers
      </Card.Header>

      <ListGroup variant={'flush'}>
        {bowler.waivers.map((w, i) => {
          return (
            <ListGroup.Item key={`${w.identifier}-${i}`}>
              <span className={`float-end`}>
                &ndash;${w.amount}
              </span>
              <span className={'d-block'}>
                {w.name}
              </span>
              <small className={'d-block fst-italic'}>
                Waived by {w.created_by}
              </small>
            </ListGroup.Item>
          );
        })}
        {bowler.waivers.length === 0 && (
          <ListGroup.Item className={`p-0`}>
            <div className={'my-3'}>
              <div className={'d-flex justify-content-center'}>
                <Button type={'button'}
                        variant={'outline-success'}
                        size={'sm'}
                        onClick={waiveClicked}>
                  <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>
                  Waive Late Fee
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );

  const officeUseOnlyCard = (
    <Card className={'mb-3'}>
      <Card.Header as={'h6'}>
        Tournament Data
      </Card.Header>
      <Card.Body className={'pb-0'}>
        <OfficeUseOnly bowler={bowler}
                       onSubmit={tournamentDataSubmitted}
                       loading={loadingParts.setTournamentData}/>
        <SuccessAlert message={success.setTournamentData} className={'mt-3 mb-0'}/>
        <ErrorAlert message={errors.setTournamentData} className={'mt-3 mb-0'}/>
      </Card.Body>
      <Card.Body className={''}>
        <Card.Text className={'text-center'}>
          <Card.Link as={Link}
                     href={{
                       pathname: '/director/tournaments/[identifier]/bowlers/[bowlerId]/sign-in-sheet',
                       query: {
                         identifier: identifier,
                         bowlerId: bowlerId,
                     }}}
                     target={'_new'}>
            Sign-in Sheet
          </Card.Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );

  const signups = bowler.signups.filter(({status}) => ['requested', 'paid'].includes(status));
  const signedUpEventsCard = (
    <Card className={'mb-3'}>
      <Card.Header as={'h6'}>
        Optional Sign-ups
      </Card.Header>
      {signups.length === 0 && <Card.Body>None</Card.Body>}
      {signups.length > 0 && (
        <ListGroup variant={'flush'}>
          {signups.map(s => (
            <ListGroup.Item key={s.identifier}>
              {s.purchasableItem.name} ({s.status})
              {s.purchasableItem.refinement === 'division' && (
                <em className={'d-block small ps-2'}>
                  Division: {s.purchasableItem.configuration.division}
                </em>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  )

  const resendEmailsCard = (
    <Card className={'mb-3'}>
      <Card.Header as={'h6'} className={'fw-light'}>
        Re-send Emails
      </Card.Header>
      <ListGroup variant={'flush'}>
        <ListGroup.Item>
          <EmailButton emailType={'registration'}
                       bowlerIdentifier={bowlerId}
                       onClick={resendEmailButtonClicked}
          />
        </ListGroup.Item>
        {bowler.ledger_entries.filter(entry => entry.source === 'stripe').map((entry, i) => (
          <ListGroup.Item key={i}>
            <EmailButton emailType={'payment_receipt'}
                         bowlerIdentifier={bowlerId}
                         onClick={resendEmailButtonClicked}
                         orderIdentifier={entry.identifier}
                         orderCredit={entry.credit}/>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: tournament.name, path: `/director/tournaments/${identifier}`},
    {text: 'Bowlers', path: `/director/tournaments/${identifier}/bowlers`},
  ];

  // Put the additional question responses at the top level of bowler data, for the form
  for (const questionKey in bowler.additional_question_responses) {
    bowler[questionKey] = bowler.additional_question_responses[questionKey].response;
  }

  return (
    <ErrorBoundary>
      <Breadcrumbs ladder={ladder} activeText={bowler.display_name}/>
      <Row>
        <Col md={8}>
          {bowlerSummary}
          <BowlerForm tournament={tournament}
                      bowlerInfoSaved={updateSubmitHandler}
                      bowlerData={bowler}
                      nextButtonText={'Update Bowler'}
          />
          <SuccessAlert message={success.updateBowler}/>
          <ErrorAlert message={bowlerError}/>
          <ErrorAlert message={errors.updateBowler}/>
        </Col>
        <Col md={4}>
          {officeUseOnlyCard}
          {signedUpEventsCard}
          {resendEmailsCard}
          {freeEntryCard}
          {moveToTeamCard}
          {assignPartnerCard}
          {bowler.purchases && bowler.purchases.length > 0 && purchases}
          {waivers}
          {ledgerEntries}
          <hr/>
          {deleteBowlerCard}
        </Col>
      </Row>
    </ErrorBoundary>
  );
}

BowlerPage.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default BowlerPage;
