import {useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

import DirectorLayout from "../../../../../../components/Layout/DirectorLayout/DirectorLayout";
import Breadcrumbs from "../../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../../../../components/common/ErrorAlert";
import BowlerSummary from "../../../../../../components/Registration/ReviewEntries/BowlerSummary";
import {useDirectorApi, useTournament} from "../../../../../../director";
import ErrorBoundary from "../../../../../../components/common/ErrorBoundary";

const Page = () => {
  const router = useRouter();
  const {identifier: tournamentId, teamId} = router.query;

  const {loading: tournamentLoading, tournament} = useTournament();
  const {loading: teamLoading, data: team, error: teamError, onDataUpdate: teamUpdated} = useDirectorApi({
    uri: teamId ? `/teams/${teamId}` : null,
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState();

  if (teamLoading) {
    return <LoadingMessage message={'Getting bowler data ready for review...'}/>
  }
  if (!tournament || !team) {
    return '';
  }

  if (teamError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team and/or bowler.'}/>
      </div>
    );
  }

  ////////////////////////////////////////

  const addBowlerSuccess = (bowlerData) => {
    // add the bowler to the team's bowlers, then call teamHasChanged
    team.bowlers = team.bowlers.concat(bowlerData);
    teamUpdated(team);
    setProcessing(false);
    router.push({
      pathname: '/director/tournaments/[identifier]/teams/[teamId]',
      query: {
        identifier: tournamentId,
        teamIdentifier: teamId,
        successCode: 2,
      }
    });
  }

  const addBowlerFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const saveClicked = () => {
    // Write the bowler to the backend, with the single bowler.
    // Upon success, redirect to the team's page, which will
    // present its options.

    // Create the bowler on the team

    // submitAddBowler({
    //   tournament: tournament,
    //   team: team,
    //   bowler: registration.bowler,
    //   onSuccess: addBowlerSuccess,
    //   onFailure: addBowlerFailure,
    // });
    setProcessing(true);
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: tournament.name, path: `/director/tournaments/${tournamentId}`},
    {text: 'Teams', path: `/director/tournaments/${tournamentId}/teams`},
  ];

  return (
    <ErrorBoundary>
      <div className={'col-md-10 offset-md-1 col-lg-8 offset-lg-2'}>
        <Breadcrumbs ladder={ladder} activeText={team.name}/>

        <h2 className={`text-center`}>
          Team:&nbsp;
          <strong>
            {team.name}
          </strong>
        </h2>

        <hr />

        <h3 className={`text-center`}>
          New Bowler Review
        </h3>

        <hr />

        <BowlerSummary bowler={registration.bowler} tournament={tournament} partner={doublesPartner} />

        <hr />

        {error && <ErrorAlert message={error}/> }

        <div className={`d-flex justify-content-between`}>
          <Link href={{
            pathname: '/director/tournaments/[identifier]/teams/[teamId]/add-bowler',
            query: {
              identifier: tournamentId,
              teamIdentifier: teamId,
              edit: true,
            }
          }}
                className={`btn btn-lg btn-outline-primary d-block ${processing && 'invisible'}`}>
            <i className={'bi bi-chevron-double-left pe-2'}
               aria-hidden={true}/>
            Make Changes
          </Link>

          <button className={`btn btn-lg btn-primary`}
                  disabled={processing}
                  onClick={saveClicked}>
            Save
            <i className={'bi bi-chevron-double-right ps-2'}
               aria-hidden={true}/>
          </button>
        </div>

        {processing && <LoadingMessage message={'Submitting bowler details...'} />}
      </div>
    </ErrorBoundary>
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
