import {useRegistrationContext} from "../../../../../store/RegistrationContext";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {devConsoleLog, useClientReady} from "../../../../../utils";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import RegistrationLayout from "../../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentHeader from "../../../../../components/ui/TournamentHeader";
import PositionChooser from "../../../../../components/common/formElements/PositionChooser/PositionChooser";
import BowlerForm from "../../../../../components/Registration/BowlerForm/BowlerForm";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, teamIdentifier, position} = router.query;

  useEffect(() => {
    if (!registration || !registration.team) {
      return;
    }

  }, [registration, registration.team]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  if (!registration || !registration.tournament || !registration.team) {
    return <LoadingMessage message={'Getting things ready...'}/>
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
    devConsoleLog("Bowler data saved!", bowlerData);
    const completeBowlerData = {
      ...bowlerData,
      position: position,
    };
    // dispatch( ... );
    // router.push({
    //   pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/review',
    //   query: {
    //     identifier: identifier,
    //     teamIdentifier: teamIdentifier,
    //   }
    // });
  }

  return (
    <div>
      <TournamentHeader tournament={registration.tournament}/>

      <h2 className={`text-center`}>
        Team:&nbsp;
        <strong>
          {registration.team.name}
        </strong>
      </h2>

      <hr />

      {/*<h4 className={'text-center'}>*/}
      {/*  <strong>Position:</strong> {position}*/}
      {/*</h4>*/}
      <PositionChooser maxPosition={registration.tournament.team_size}
                       chosen={position}
                       onChoose={otherPositionClicked}/>

      <hr />

      <h3 className={`text-center`}>
        Add a Bowler
      </h3>

      <hr />

      <BowlerForm tournament={registration.tournament}
                  // bowlerData={previousBowlerData}
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
