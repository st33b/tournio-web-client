import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Card} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import TeamListing from "../../../components/Director/TeamListing/TeamListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import NewTeamForm from "../../../components/Director/NewTeamForm/NewTeamForm";
import {directorApiRequest, useDirectorApi} from "../../../director";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import SuccessAlert from "../../../components/common/SuccessAlert";
import ErrorAlert from "../../../components/common/ErrorAlert";
import {useLoginContext} from "../../../store/LoginContext";

const Page = () => {
  const router = useRouter();
  const {state} = useDirectorContext();
  const {authToken} = useLoginContext();
  const {delete: deleteSuccess} = router.query;

  const [successMessage, setSuccessMessage] = useState();

  // Fetch the bowlers from the backend
  const {loading, data: teams, error, onDataUpdate} = useDirectorApi({
    uri: state.tournament ? `/tournaments/${state.tournament.identifier}/teams` : null,
    initialData: [],
  });

  const newTeamSubmitSuccess = (data) => {
    const newTeams = teams.concat(data);
    onDataUpdate(newTeams);
    setSuccessMessage('Team created.');
  }

  const newTeamSubmitted = (teamName) => {
    const uri = `/tournaments/${state.tournament.identifier}/teams`;
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        team: {
          name: teamName,
          options: {
            place_with_others: true
          },
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: newTeamSubmitSuccess,
    });
  }

  if (!state.tournament || loading) {
    return <LoadingMessage message={'Retrieving team data...'} />
  }

  ////////////////////////////////////////////////////////////////////////

  const newTeam = (
    <Card>
      <Card.Header as={'h5'} className={'fw-light'}>
        New Team
      </Card.Header>
      <Card.Body>
        <NewTeamForm submitted={newTeamSubmitted} />
      </Card.Body>
    </Card>
  );

  const ladder = [{text: 'Tournaments', path: '/director'}];
  ladder.push({text: state.tournament.name, path: `/director/tournaments/${state.tournament.identifier}`});

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={'Teams'}/>
      <div className={'row'}>
        <div className={'order-2 order-md-1 col'}>
          {deleteSuccess && (
            <SuccessAlert className={``}
                          message={`Team deleted`}
                          onClose={router.replace(router.pathname, null, {shallow: true})}
                          />
          )}
          {error && (
            <ErrorAlert className={``}
                        message={error.message}  />
          )}
          <TeamListing teams={teams} shiftCount={state.tournament.shifts.length}/>
        </div>
        <div className={'order-1 order-md-2 col-12 col-md-4'}>
          {newTeam}
          {successMessage && (
            <SuccessAlert className={`mt-3`}
                          message={successMessage}
                          onClose={() => setSuccessMessage(null)}
            />
          )}
        </div>
      </div>
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
