import {useRouter} from "next/router";
import RegistrationLayout from "../../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentHeader from "../../../../../components/ui/TournamentHeader";
import {useEffect, useState} from "react";
import PositionChooser from "../../../../../components/common/formElements/PositionChooser/PositionChooser";
import {updateObject, useTeam, useTournament} from "../../../../../utils";
import SuccessAlert from "../../../../../components/common/SuccessAlert";
import RegisteredBowler from "../../../../../components/Registration/RegisteredBowler/RegisteredBowler";
import AddBowler from "../../../../../components/Registration/AddBowler/AddBowler";

import ErrorAlert from "../../../../../components/common/ErrorAlert";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import PositionUnavailable from "../../../../../components/Registration/PositionUnavailable/PositionUnavailable";
import UrlShare from "../../../../../components/ui/UrlShare/UrlShare";

const Page = () => {
  const router = useRouter();
  const {identifier, teamIdentifier, chosen, success} = router.query;

  const [state, setState] = useState({
    chosenPosition: 1,
    successMessage: null,
    currentLocation: null,
  });

  useEffect(() => {
    let updatedSuccessMsg = state.successMessage;
    switch (success) {
      case '1':
        updatedSuccessMsg = 'Team and bowler created.';
        break;
      case '2':
        updatedSuccessMsg = 'Bowler added to team.';
        break;
      default:
        break;
    }

    let chosenPosition = chosen ? parseInt(chosen) : state.chosenPosition;
    if (isNaN(chosenPosition)) {
      chosenPosition = 1;
    }

    setState(updateObject(state, {
      successMessage: updatedSuccessMsg,
      chosenPosition: chosenPosition,
      currentLocation: window.location,
    }));

  }, [chosen, success]);

  const {loading: teamLoading, team, error: fetchError} = useTeam(teamIdentifier);
  const {loading: tournamentLoading, tournament, error: tournamentError} = useTournament(identifier);

  if (teamLoading || tournamentLoading) {
    return (
        <div>
          <LoadingMessage message={'Loading the team'}/>
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

  const positionChosen = (position) => {
    setState(updateObject(state, {
      chosenPosition: position,
    }));
    router.replace({
          pathname: `/tournaments/[identifier]/teams/[teamIdentifier]/[chosen]`,
          query: {
            identifier: identifier,
            teamIdentifier: teamIdentifier,
            chosen: position,
          },
        },
        null,
        { shallow: true },
    );
  }

  const dropQueryParams = () => {
    router.replace({
        pathname: `/tournaments/[identifier]/teams/[teamIdentifier]/[chosen]`,
        query: {
          identifier: identifier,
          teamIdentifier: teamIdentifier,
          chosen: chosen,
        },
      },
      null,
      { shallow: true },
    );
  }

  const contentByPosition = Array(tournament.team_size);
  const noMoreOpenings = team.bowlers.length === team.initial_size;
  for (let i = 0; i < tournament.team_size; i++) {
    const currentPosition = i + 1;
    const bowler = team.bowlers.find(({position}) => position === currentPosition);
    let content = '';
    if (bowler) {
      content = <RegisteredBowler bowler={bowler}/>;
    } else if (noMoreOpenings) {
      content = <PositionUnavailable/>;
    } else {
      content = <AddBowler tournament={tournament}
                           team={team}
                           position={currentPosition}/>;
    }
    contentByPosition[i] = content;
  }

  const port = process.env.NODE_ENV === 'development' ? `:${state.currentLocation.port}` : '';
  const shareUrl = `${state.currentLocation.protocol}//${state.currentLocation.hostname}${port}/teams/${teamIdentifier}`;

  return (
    <div className={`col-md-8 offset-md-2`}>
      <TournamentHeader tournament={tournament}/>

      {state.successMessage && <SuccessAlert message={state.successMessage}
                                             onClose={dropQueryParams}
      />}

      <h3 className={'text-center'}>
        Team: <strong>{team.name}</strong>
      </h3>

      <h5 className={'text-center'}>
        Shift Preference: {team.shifts.map(({name}) => name).join(', ')}
      </h5>

      <UrlShare url={shareUrl}/>

      <hr/>

      {/* URL */}

      {/* URL copy function */}

      <PositionChooser maxPosition={tournament.team_size}
                       chosen={state.chosenPosition}
                       onChoose={positionChosen}/>

      {contentByPosition[state.chosenPosition - 1]}
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
