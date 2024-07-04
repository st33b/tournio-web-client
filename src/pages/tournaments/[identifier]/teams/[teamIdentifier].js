import {useRouter} from "next/router";
import RegistrationLayout from "../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import TournamentHeader from "../../../../components/ui/TournamentHeader";
import UrlShare from "../../../../components/ui/UrlShare/UrlShare";
import {devConsoleLog, updateObject, useTeam, useTheTournament} from "../../../../utils";
import ErrorAlert from "../../../../components/common/ErrorAlert";
import Link from "next/link";

const Page = () => {
  devConsoleLog("------------ page untouched in team restoration");
  const router = useRouter();
  const {identifier, teamIdentifier} = router.query;

  const [state, setState] = useState({
    currentLocation: null,
  });

  useEffect(() => {
    setState(updateObject(state, {
      currentLocation: window.location,
    }));
  }, []);

  const {loading: teamLoading, team, error: fetchError} = useTeam(teamIdentifier);
  const {loading: tournamentLoading, tournament, error: tournamentError} = useTheTournament(identifier);

  if (teamLoading || tournamentLoading) {
    return (
      <div>
        <LoadingMessage message={'Retrieving team details'}/>
      </div>
    );
  }

  if (fetchError || tournamentError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team.'}/>
      </div>
    );
  }

  if (!tournament || !team || !team.bowlers) {
    return '';
  }

  //////////////////////////

  const port = process.env.NODE_ENV === 'development' ? `:${state.currentLocation.port}` : '';
  const shareUrl = `${state.currentLocation.protocol}//${state.currentLocation.hostname}${port}/teams/${teamIdentifier}`;

  const tournamentType = tournament.config['tournament_type'];

  const rows = Array(tournament.config['team_size']);
  let firstAvailablePosition = 0;
  for (let i = 0; i < tournament.config['team_size']; i++) {
    const currentPosition = i + 1;
    const bowler = team.bowlers.find(({position}) => position === currentPosition);
    let row = '';
    if (bowler) {
      row = (
        <div className={'d-flex align-items-center py-2 tournio-striped-list-item'} key={`row${i}`}>
          <div className={'ps-2'}>
            {bowler.position}.
          </div>
          <div className={'ps-3'}>
            {bowler.full_name}
          </div>
          <div className={'ms-auto pe-2'}>
            <Link className={`btn btn-sm btn-success`}
                  title={'Pay entry fees, choose extras'}
                  href={`/bowlers/${bowler.identifier}`}>
              Fees&nbsp;&amp;&nbsp;Extras
            </Link>
          </div>
        </div>
      );
    } else {
      if (firstAvailablePosition === 0) {
        firstAvailablePosition = currentPosition;
      }
      row = (
        <div className={'d-flex align-items-center py-2 tournio-striped-list-item'} key={`row${i}`}>
          <div className={'ps-2'}>
            {currentPosition}.
          </div>
          <div className={'ms-auto pe-2'}>
            <Link className={''}
                  href={{
                    pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/add-bowler',
                    query: {
                      identifier: tournament.identifier,
                      teamIdentifier: team.identifier,
                      position: currentPosition,
                    }
                  }}
            >
              <span className={'bi bi-plus-lg'} aria-hidden={true}/>
              <span className={'visually-hidden'}>
                  Add a Bowler
                </span>
            </Link>
          </div>
        </div>
      );
    }
    rows[i] = row;
  }

  const showPreferredShift = tournamentType === 'igbo_multi_shift' || tournamentType === 'single_event' && tournament.shifts.length > 1;
  const showMultipleShifts = tournamentType === 'igbo_mix_and_match';

  return (
    <div className={`row`}>
      <div className={`col-12`}>
        <TournamentHeader tournament={tournament}/>
      </div>

      <div className={`col-lg-8 col-xl-6 offset-lg-2 offset-xl-3`}>
        <div className={`display-6 pt-2 py-3 bg-primary-subtle`}>
          {firstAvailablePosition > 0 && 'Team Registration'}
          {firstAvailablePosition === 0 && 'Team Details'}
        </div>

        <h3 className={'py-3'}>
          Name: <strong>{team.name}</strong>
        </h3>

        {showPreferredShift && (
          <h4 className={'pb-2'}>
            Shift Preference: {team.shifts[0].name}
          </h4>
        )}
        {showMultipleShifts && (
          <h4 className={'pb-2'}>
            Shift Preferences: {team.shifts.map(({name}) => name).join(', ')}
          </h4>
        )}

        <h5 className={'pb-2'}>
          Bowlers:
        </h5>
        <div className={'tournio-striped-list'}>
          {rows}
        </div>

        {firstAvailablePosition > 0 && (
          <div className={'text-end'}>
            <Link className={'btn btn-primary my-3'}
                  href={{
                    pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/add-bowler',
                    query: {
                      identifier: tournament.identifier,
                      teamIdentifier: team.identifier,
                      position: firstAvailablePosition,
                    }
                  }}
            >
              <span className={''}>Next Bowler</span>
              <span className={'bi bi-chevron-double-right ps-2'} aria-hidden={true}/>
            </Link>
          </div>
        )}

        <UrlShare url={shareUrl}/>

      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;
