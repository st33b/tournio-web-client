import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded, newTeamPartnersChosen} from "../../../store/actions/registrationActions";
import {devConsoleLog, useClientReady} from "../../../utils";
import ErrorBoundary from "../../../components/common/ErrorBoundary";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import PositionChooser from "../../../components/common/formElements/PositionChooser/PositionChooser";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;

  const [chosenPosition, choosePosition] = useState(1);

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!identifier || !registration || !registration.tournament) {
      return;
    }
    if (!registration.tournament.registration_options.new_team) {
      router.push(`/tournaments/${identifier}`);
    }
    if (edit) {
      devConsoleLog("Edit is true.");
      choosePosition(registration.bowler.position);
    }
  }, [registration]);

  const ready = useClientReady();
  if (!ready) {
    return (
      <div>
        <LoadingMessage message={'Getting the registration form ready'}/>
      </div>
    );
  }
  if (!registration.tournament) {
    return (
      <div>
        <LoadingMessage message={'Getting the registration form ready'}/>
      </div>
    );
  }

  // const onFinishedWithBowlers = () => {
  //   switch (registration.team.bowlers.length) {
  //     case 1:
  //       router.push(`/tournaments/${registration.tournament.identifier}/review-entries`);
  //       break;
  //     case 2:
  //       partnerThePairUp();
  //       router.push(`/tournaments/${registration.tournament.identifier}/review-entries`);
  //       break;
  //     default:
  //       // Move on to doubles partner selection!
  //       router.push(`/tournaments/${registration.tournament.identifier}/doubles-partners`);
  //   }
  // }
  //
  const newBowlerAdded = (bowlerInfo) => {
    devConsoleLog("Bowler saved... now what?");

    // put the chosen position into the bowler info
    const bowlerData = {
      ...bowlerInfo,
      position: chosenPosition,
    }

    dispatch(newTeamBowlerInfoAdded(bowlerData));

    router.push(`/tournaments/${identifier}/new-team-review`);
  }

  const positionChosen = (position) => {
    choosePosition(position);
  }

  const previousBowlerData = edit ? registration.bowler : null;
  devConsoleLog("Previous bowler data: ", previousBowlerData);

  return (
    <div>
      <div className={`display-2 text-center mt-3`}>
        {registration.tournament.abbreviation} {registration.tournament.year}
      </div>

      <hr />

      <h2 className={`text-center`}>
        Team:&nbsp;
        <strong>
          {registration.team.name}
        </strong>
      </h2>

      <hr />

      <h3 className={`text-center`}>
        Add a Bowler
      </h3>

      <hr />

      <PositionChooser maxPosition={registration.tournament.team_size}
                       chosen={chosenPosition}
                       onChoose={positionChosen}/>

      <BowlerForm tournament={registration.tournament}
                  bowlerData={previousBowlerData}
                  bowlerInfoSaved={newBowlerAdded}/>


    </div>
    // <Row>
    //   <Col>
    //     <Summary tournament={registration.tournament}
    //              nextStepClicked={onFinishedWithBowlers}
    //              nextStepText={'Finished With Bowlers'}
    //     />
    //   </Col>
    //   <Col lg={8}>
    //     <ProgressIndicator active={'bowlers'}/>
    //     <BowlerForm tournament={registration.tournament}
    //                 bowlerInfoSaved={onNewBowlerAdded}/>
    //   </Col>
    // </Row>
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
