import {useRouter} from "next/router";

import InformationLayout from "../../../components/Layout/InformationLayout/InformationLayout";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded} from "../../../store/actions/registrationActions";
import {devConsoleLog, useTheTournament} from "../../../utils";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import PositionChooser from "../../../components/common/formElements/PositionChooser/PositionChooser";
import TournamentHeader from "../../../components/ui/TournamentHeader";
import Link from "next/link";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import Sidebar from "../../../components/Registration/Sidebar/Sidebar";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;

  const [chosenPosition, choosePosition] = useState(1);

  const {loading, tournament} = useTheTournament(identifier);

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!identifier || !tournament || !registration) {
      return;
    }
    if (!tournament.registrationOptions.new_team) {
      router.push(`/tournaments/${identifier}`);
    }
    if (edit) {
      devConsoleLog("Edit is true.");
      choosePosition(registration.bowler.position);
    }
  }, [edit, tournament, registration]);

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Looking for the tournament...'}/>
      </div>
    );
  }

  // const newBowlerAdded = (bowlerInfo) => {
  //   // put the chosen position into the bowler info
  //   const bowlerData = {
  //     ...bowlerInfo,
  //     position: chosenPosition,
  //   }
  //
  //   dispatch(newTeamBowlerInfoAdded(bowlerData));
  //
  //   router.push(`/tournaments/${identifier}/new-team-review`);
  // }

  // const positionChosen = (position) => {
  //   choosePosition(position);
  // }
  //
  // const previousBowlerData = edit ? registration.bowler : null;

  const titleText = edit ? 'Make Changes' : 'Add Bowler Details';

  return (
    // <div className={'row'}>
    //   <div className={'col-12'}>
    //     <TournamentHeader tournament={tournament}/>
    //
    //     <h2 className={`bg-primary-subtle py-3`}>
    //       First Bowler
    //     </h2>
    //
    //     <h4 className={``}>
    //       Team:&nbsp;
    //       <strong>
    //         {registration.team.name}
    //       </strong>
    //     </h4>
    //
    //   </div>
    //
    //   <div className={'col-md-10 offset-md-1 col-lg-8 offset-lg-2'}>
    //     <PositionChooser maxPosition={tournament.teamSize}
    //                      chosen={chosenPosition}
    //                      onChoose={positionChosen}/>
    //
    //     <BowlerForm tournament={tournament}
    //                 bowlerData={previousBowlerData}
    //                 bowlerInfoSaved={newBowlerAdded}/>
    //
    //   </div>
    // </div>


    <>
      <div className={'row d-md-none'}>
        <div className={'col-5'}>
          <Link href={`/tournaments/${identifier}`}>
            <TournamentLogo url={tournament.imageUrl} additionalClasses={'mb-2'}/>
          </Link>
        </div>
        <p className={'col display-4'}>
          {titleText}
        </p>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-4'}>

          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
            <p className={'col display-5'}>
              {titleText}
            </p>
          </div>

          <Sidebar tournament={tournament}
                   isTeam={true}/>
        </div>

        <div className={'col-12 col-md-8'}>
          <ProgressIndicator active={'team'}/>
          <TeamForm tournament={tournament}
                    team={registration.team}
                    onSubmit={teamFormCompleted} />
        </div>
      </div>
    </>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <InformationLayout>
      {page}
    </InformationLayout>
  );
}

export default Page;
