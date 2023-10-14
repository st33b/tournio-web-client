import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Card, Button, Row, Col} from "react-bootstrap";

import DirectorLayout from "../../../../../components/Layout/DirectorLayout/DirectorLayout";
import Breadcrumbs from "../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import TeamDetails from "../../../../../components/Director/TeamDetails/TeamDetails";
import {directorApiRequest, useDirectorApi, useTournament} from "../../../../../director";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import TeamShiftForm from "../../../../../components/Director/TeamDetails/TeamShiftForm";
import {useLoginContext} from "../../../../../store/LoginContext";
import SuccessAlert from "../../../../../components/common/SuccessAlert";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import {updateObject} from "../../../../../utils";

const Page = () => {
  const router = useRouter();
  const {authToken} = useLoginContext();
  const {identifier: tournamentId, teamId, successCode} = router.query;

  const {loading: tournamentLoading, tournament, tournamentUpdatedQuietly} = useTournament();
  const {loading: teamLoading, data: team, error: teamError, onDataUpdate: onTeamUpdate} = useDirectorApi({
    uri: teamId ? `/teams/${teamId}` : null,
  });

  const [success, setSuccess] = useState({
    update: null,
  });
  const [errors, setErrors] = useState({
    delete: null,
    update: null,
  });
  const [operationInProgress, setOperationInProgress] = useState({
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (!successCode) {
      return;
    }
    let msg = '';
    switch (successCode) {
      case '2':
        msg = 'Bowler added';
        break;
      default:
        msg = 'Something went well!';
        break;
    }
    setSuccess({
      ...success,
      update: msg,
    });
  }, [successCode]);

  const onDeleteTeamSuccess = (_) => {
    setOperationInProgress({
      ...operationInProgress,
      delete: false,
    });
    const modifiedTournament = updateObject(tournament, {
      team_count: tournament.team_count - 1,
    });
    tournamentUpdatedQuietly(modifiedTournament);

    const urlObject = {
      pathname: `/director/tournaments/[identifier]/teams`,
      query: {
        identifier: tournamentId,
        success: `deleted`,
      }
    }
    router.push(urlObject);
  }

  const onDeleteTeamFailure = (error) => {
    setOperationInProgress({
      ...operationInProgress,
      delete: false,
    });
    setErrors({
      ...errors,
      delete: error.message,
    });
  }

  const deleteSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm('This will remove the team and all its bowlers. Are you sure?')) {
      const uri = `/teams/${teamId}`;
      const requestConfig = {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      setOperationInProgress({
        ...operationInProgress,
        delete: true,
      });
      directorApiRequest({
        uri: uri,
        requestConfig: requestConfig,
        authToken: authToken,
        onSuccess: onDeleteTeamSuccess,
        onFailure: onDeleteTeamFailure,
      });
    }
  }

  const updateTeamSuccess = (data) => {
    setOperationInProgress({
      ...operationInProgress,
      update: false,
    });
    setSuccess({
      ...success,
      update: 'Changes applied',
    });
    onTeamUpdate(data);
  }

  const updateTeamFailure = (data) => {
    setOperationInProgress({
      ...operationInProgress,
      update: false,
    });
    setErrors({
      ...errors,
      update: data.message,
    });
  }

  const updateSubmitHandler = (teamData) => {
    const uri = `/teams/${teamId}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        team: teamData,
      },
    }
    setOperationInProgress({
      ...operationInProgress,
      update: true,
    });
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: updateTeamSuccess,
      onFailure: updateTeamFailure,
    });
  }

  const shiftChangeHandler = (newShiftIdentifier) => {
    updateSubmitHandler({
      shift_identifier: newShiftIdentifier,
    });
  }

  ////////////////////////////////////////////////////////////////////

  if (tournamentLoading || teamLoading || !team) {
    return <LoadingMessage message={'Retrieving team details...'}/>
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: tournament.name, path: `/director/tournaments/${tournamentId}`},
    {text: 'Teams', path: `/director/tournaments/${tournamentId}/teams`},
  ];


  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={team.name}/>
      <Row>
        <Col md={8}>
          <TeamDetails team={team}
                       teamUpdateSubmitted={updateSubmitHandler}
          />
        </Col>

        <Col md={4}>
          {tournament.shifts.length > 1 && (
            <Card className={'mb-3'}>
              <Card.Header as={'h5'}>
                Shift
              </Card.Header>
              <Card.Body>
                <TeamShiftForm allShifts={tournament.shifts} team={team} onShiftChange={shiftChangeHandler}/>
              </Card.Body>
            </Card>
          )}

          <Card>
            <Card.Body className={'text-center'}>
              <form onSubmit={deleteSubmitHandler}>
                <Button variant={'danger'}
                        type={'submit'}
                >
                  Delete Team
                </Button>
              </form>
            </Card.Body>
          </Card>

          <SuccessAlert message={success.update}
                        className={`mt-3`}
                        onClose={() => setSuccess({
                          ...success,
                          update: null,
                        })}
          />
          <ErrorAlert message={errors.update}
                      className={`mt-3`}
                      onClose={() => setErrors({
                        ...errors,
                        update: null,
                      })}
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
