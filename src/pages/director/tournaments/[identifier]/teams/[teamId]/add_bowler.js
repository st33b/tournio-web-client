import {useRouter} from "next/router";
import {useLoginContext} from "../../../../../../store/LoginContext";
import {useDirectorApi, useTournament} from "../../../../../../director";
import DirectorLayout from "../../../../../../components/Layout/DirectorLayout/DirectorLayout";
import {useEffect, useState} from "react";
import ErrorBoundary from "../../../../../../components/common/ErrorBoundary";
import LoadingMessage from "../../../../../../components/ui/LoadingMessage/LoadingMessage";
import Breadcrumbs from "../../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import {devConsoleLog} from "../../../../../../utils";
import ErrorAlert from "../../../../../../components/common/ErrorAlert";
import PositionChooser from "../../../../../../components/common/formElements/PositionChooser/PositionChooser";
import BowlerForm from "../../../../../../components/Registration/BowlerForm/BowlerForm";

const Page = () => {
  const router = useRouter();
  const {authToken} = useLoginContext();
  const {identifier: tournamentId, teamId} = router.query;

  const {loading: tournamentLoading, tournament, tournamentUpdatedQuietly} = useTournament();
  const {loading: teamLoading, data: team, error: teamError, onDataUpdate: onTeamUpdate} = useDirectorApi({
    uri: teamId ? `/teams/${teamId}` : null,
  });

  const [chosenPosition, choosePosition] = useState();
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  useEffect(() => {
    if (!tournament || !team || chosenPosition > 0) {
      return;
    }
    const occupied = team.bowlers.map(({position}) => position).sort();
    for (let i = 0; i < parseInt(tournament.team_size); i++) {
      if (occupied[i] !== i + 1) {
        // We've found the first unoccupied position
        choosePosition(i + 1);
        setOccupiedPositions(occupied);
        break;
      }
    }
  }, [tournament, team]);

  const anotherPositionClicked = (otherPosition) => {
    choosePosition(otherPosition);
  }

  const bowlerInfoSaved = (bowlerData) => {
    // Save it!
    devConsoleLog("Save it.");
  }
  ////////////////////////////////////////////////////////////////////

  if (teamError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team.'}/>
      </div>
    );
  }

  if (tournamentLoading || teamLoading || !team) {
    return <LoadingMessage message={'Retrieving bowler registration form...'}/>
  }

  const maxPosition = parseInt(tournament.team_size);

  const availableDoublesPartners = team.bowlers.filter(partner => (
    partner.doubles_partner_name === 'n/a'
  ));

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: tournament.name, path: `/director/tournaments/${tournamentId}`},
    {text: 'Teams', path: `/director/tournaments/${tournamentId}/teams`},
  ];

  return (
    <ErrorBoundary>
      <Breadcrumbs ladder={ladder} activeText={team.name}/>

      <h2 className={`text-center`}>
        Team:&nbsp;
        <strong>
          {team.name}
        </strong>
      </h2>

      <hr />

      <h3 className={`text-center`}>
        Add a Bowler
      </h3>

      <hr />

      <PositionChooser maxPosition={maxPosition}
                       chosen={chosenPosition}
                       onChoose={anotherPositionClicked}
                       disallowedPositions={occupiedPositions}
      />

      <hr />

      <BowlerForm tournament={tournament}
                  availablePartners={availableDoublesPartners}
                  bowlerInfoSaved={bowlerInfoSaved}/>

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
