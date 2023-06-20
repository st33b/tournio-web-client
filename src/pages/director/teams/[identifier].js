import React, {useState} from "react";
import {useRouter} from "next/router";
import {Card, Button, Row, Col} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import TeamDetails from "../../../components/Director/TeamDetails/TeamDetails";
import {directorApiRequest, useDirectorApi} from "../../../director";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import TeamShiftForm from "../../../components/Director/TeamDetails/TeamShiftForm";
import {useLoginContext} from "../../../store/LoginContext";
import SuccessAlert from "../../../components/common/SuccessAlert";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const router = useRouter();
  const {state, dispatch} = useDirectorContext();
  const {authToken} = useLoginContext();

  let {identifier} = router.query;

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

  const updateStateForTeam = (data) => {
    // any state data the team needs...
  }

  const {loading: teamLoading, data: team, error: teamError, onDataUpdate: onTeamUpdate} = useDirectorApi({
    uri: identifier ? `/teams/${identifier}` : null,
    onSuccess: updateStateForTeam,
  });

  const onDeleteTeamSuccess = (_) => {
    setOperationInProgress({
      ...operationInProgress,
      delete: false,
    });
    router.push('/director/teams?success=deleted');
  }

  const onDeleteTeamFailure = (data) => {
    setOperationInProgress({
      ...operationInProgress,
      delete: false,
    });
    setErrors({
      ...errors,
      delete: data.getMessage,
    });
  }

  const deleteSubmitHandler = (event) => {
    event.preventDefault();
    if (confirm('This will remove the team and all its bowlers. Are you sure?')) {
      const uri = `/teams/${identifier}`;
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
    const uri = `/teams/${identifier}`;
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

  if (!state.tournament || teamLoading || !team) {
    return <LoadingMessage message={'Retrieving team details...'}/>
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: state.tournament.name, path: `/director/tournaments/${state.tournament.identifier}`},
    {text: 'Teams', path: `/director/teams`},
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
          {state.tournament.shifts.length > 1 && (
            <Card className={'mb-3'}>
              <Card.Header as={'h5'}>
                Shift
              </Card.Header>
              <Card.Body>
                <TeamShiftForm allShifts={state.tournament.shifts} team={team} onShiftChange={shiftChangeHandler}/>
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
