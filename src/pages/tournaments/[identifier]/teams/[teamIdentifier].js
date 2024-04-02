import {useRouter} from "next/router";
import RegistrationLayout from "../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import TournamentHeader from "../../../../components/ui/TournamentHeader";
import SuccessAlert from "../../../../components/common/SuccessAlert";
import UrlShare from "../../../../components/ui/UrlShare/UrlShare";
import {updateObject, useTeam, useTournament} from "../../../../utils";
import ErrorAlert from "../../../../components/common/ErrorAlert";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const {identifier, teamIdentifier, success} = router.query;

  const [state, setState] = useState({
    successMessage: null,
    currentLocation: null,
  });

  useEffect(() => {
    let newSuccessMessage = state.successMessage;
    switch (success) {
      case '1':
        newSuccessMessage = 'Team and bowler created.';
        break;
      case '2':
        newSuccessMessage = 'Bowler added to team.';
        break;
      default:
        break;
    }
    setState(updateObject(state, {
      successMessage: newSuccessMessage,
      currentLocation: window.location,
    }));
  }, [success]);

  const {loading: teamLoading, team, error: fetchError} = useTeam(teamIdentifier);
  const {loading: tournamentLoading, tournament, error: tournamentError} = useTournament(identifier);

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

  const dropQueryParams = () => {
    router.replace({
        pathname: `/tournaments/[identifier]/teams/[teamIdentifier]`,
        query: {
          identifier: identifier,
          teamIdentifier: teamIdentifier,
        },
      },
      null,
      { shallow: true },
    );
  }

  const port = process.env.NODE_ENV === 'development' ? `:${state.currentLocation.port}` : '';
  const shareUrl = `${state.currentLocation.protocol}//${state.currentLocation.hostname}${port}/teams/${teamIdentifier}`;

  const tournamentType = tournament.config_items.find(({key}) => key === 'tournament_type').value || 'igbo_standard';

  const rows = Array(tournament.team_size);
  for (let i = 0; i < tournament.team_size; i++) {
    const currentPosition = i + 1;
    const bowler = team.bowlers.find(({position}) => position === currentPosition);
    let row = '';
    if (bowler) {
      row = (
        <tr key={`row${i}`}>
          <td>
            {bowler.position}.
          </td>
          <td>
            {bowler.full_name}
          </td>
          <td>
            <Link className={`ms-auto ms-sm-0`}
                  title={'Pay entry fees, choose extras'}
                  href={`/bowlers/${bowler.identifier}`}>
              Fees&nbsp;&amp;&nbsp;Extras
            </Link>
          </td>
        </tr>
      );
    } else {
      row = (
        <tr key={`row${i}`}>
          <td>
            {currentPosition}.
          </td>
          <td colSpan={2}>
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
              <span className={'bi bi-plus pe-1'} aria-hidden={true}/>
              Add Bowler
            </Link>
          </td>
        </tr>
      );
    }
    rows[i] = row;
  }

  return (
    <div className={`col-lg-8 col-xl-6 offset-lg-2 offset-xl-3`}>
      <TournamentHeader tournament={tournament}/>

      {state.successMessage && <SuccessAlert message={state.successMessage} onClose={dropQueryParams}
      />}

      <h3 className={''}>
        Team: <strong>{team.name}</strong>
      </h3>

      {tournamentType === 'igbo_multi_shift' && (
        <h5 className={''}>
          Shift Preference: {team.shifts.map(({name}) => name).join(', ')}
        </h5>
      )}
      {tournamentType === 'igbo_mix_and_match' && (
        <h5 className={''}>
          Shift Preferences: {team.shifts.map(({name}) => name).join(', ')}
        </h5>
      )}

      <table className={'teamRoster table table-responsive table-striped'}>
        <tbody>
          {rows}
        </tbody>
      </table>

      <UrlShare url={shareUrl}/>

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
