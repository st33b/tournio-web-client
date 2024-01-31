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

  const contentByPosition = Array(tournament.team_size);
  for (let i = 0; i < tournament.team_size; i++) {
    const currentPosition = i + 1;
    const bowler = team.bowlers.find(({position}) => position === currentPosition);
    let content = '';
    if (bowler) {
      content = (
        <li className={'list-group-item d-flex mb-4 mb-lg-2'} key={i}>
          <span className={'d-block pe-2'}>
            {bowler.position}.
          </span>
          <span className={'d-block'}>
            {bowler.full_name}
          </span>
          <hr className={'flex-grow-1 mx-3 d-none d-sm-block'} />
          <Link className={`ms-auto ms-sm-0`}
                title={'Pay entry fees, choose extras'}
                href={`/bowlers/${bowler.identifier}`}>
            Fees &amp; Extras
          </Link>
        </li>
      );
    } else {
      content = (
        <li className={'list-group-item d-flex mb-4 mb-lg-2'} key={i}>
          <span className={'d-block pe-2'}>
            {currentPosition}.
          </span>
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
        </li>
      )
    }
    contentByPosition[i] = content;
  }

  return (
    <div className={`col-lg-8 offset-lg-2`}>
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

      <UrlShare url={shareUrl}/>

      <ul className={'list-group-flush ps-0 teamRoster'}>
        {contentByPosition}
      </ul>

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
