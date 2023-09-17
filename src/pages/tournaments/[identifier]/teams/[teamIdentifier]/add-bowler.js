import {useRegistrationContext} from "../../../../../store/RegistrationContext";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useTeam} from "../../../../../utils";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import RegistrationLayout from "../../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentHeader from "../../../../../components/ui/TournamentHeader";
import PositionChooser from "../../../../../components/common/formElements/PositionChooser/PositionChooser";
import BowlerForm from "../../../../../components/Registration/BowlerForm/BowlerForm";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import {existingTeamBowlerInfoAdded} from "../../../../../store/actions/registrationActions";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, teamIdentifier, position = 1, edit} = router.query;

  const [chosenPosition, choosePosition] = useState();
  useEffect(() => {
    if (!registration || !teamIdentifier) {
      return;
    }
    if (registration.bowler && registration.bowler.position) {
      choosePosition(registration.bowler.position);
    } else {
      choosePosition(parseInt(position));
    }
  }, [registration, teamIdentifier, position]);

  const {loading, team, error: fetchError } = useTeam(teamIdentifier);

  if (!registration || !registration.tournament) {
    return '';
  }

  if (loading) {
    return <LoadingMessage message={'Getting things ready...'}/>
  }
  if (!team) {
    return '';
  }

  if (fetchError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team.'}/>
      </div>
    );
  }

  //////////////////////

  const otherPositionClicked = (otherPosition) => {
    router.push({
      pathname: '/tournaments/[identifier]/teams/[teamIdentifier]',
      query: {
        identifier: identifier,
        teamIdentifier: teamIdentifier,
        chosen: otherPosition,
      }
    });
  }

  const bowlerInfoSaved = (bowlerData) => {
    const completeBowlerData = {...bowlerData};
    if (!bowlerData.position) {
      completeBowlerData.position = chosenPosition;
    }
    dispatch(existingTeamBowlerInfoAdded(completeBowlerData));
    router.push({
      pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/review-bowler',
      query: {
        identifier: identifier,
        teamIdentifier: teamIdentifier,
      }
    });
  }

  const previousBowlerData = edit && registration.bowler ? registration.bowler : null;

  const availableDoublesPartners = team.bowlers.filter(partner => (
    partner.doubles_partner_name === 'n/a'
  ));
  return (
    <div className={'col-md-10 offset-md-1 col-lg-8 offset-lg-2'}>
      <TournamentHeader tournament={registration.tournament}/>

      <h2 className={`text-center`}>
        Team:&nbsp;
        <strong>
          {team.name}
        </strong>
      </h2>

      <hr />

      <PositionChooser maxPosition={registration.tournament.team_size}
                       chosen={chosenPosition}
                       onChoose={otherPositionClicked}/>

      <hr />

      <h3 className={`text-center`}>
        Add a Bowler
      </h3>

      <hr />

      <BowlerForm tournament={registration.tournament}
                  bowlerData={previousBowlerData}
                  availablePartners={availableDoublesPartners}
                  bowlerInfoSaved={bowlerInfoSaved}/>

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
