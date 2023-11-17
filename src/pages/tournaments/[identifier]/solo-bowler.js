import {useEffect} from "react";
import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {
  soloBowlerInfoAdded
} from "../../../store/actions/registrationActions";
import {devConsoleLog, useClientReady} from "../../../utils";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import TournamentHeader from "../../../components/ui/TournamentHeader";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier} = router.query;

  useEffect(() => {
    if (!identifier || !registration || !registration.tournament) {
      return;
    }
    if (!registration.tournament.registration_options.solo) {
      router.push(`/tournaments/${identifier}`);
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

  /////////////////////////////////////

  const bowlerInfoSaved = (bowlerData) => {

    devConsoleLog("Bowler data saved!", bowlerData);
    dispatch(soloBowlerInfoAdded(bowlerData));
    router.push({
      pathname: '/tournaments/[identifier]/solo-bowler-review',
      query: {
        identifier: identifier,
      }
    });
  }

  const previousBowlerData = registration.bowler ? registration.bowler : null;

  return (
    <div>
      <TournamentHeader tournament={registration.tournament}/>

      <h3 className={`text-center`}>
        Solo Registration
      </h3>

      <hr />

      <BowlerForm tournament={registration.tournament}
                  bowlerData={previousBowlerData}
                  solo={true}
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
