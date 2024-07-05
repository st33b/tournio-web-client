import {useEffect} from "react";
import {useRouter} from "next/router";

import InformationLayout from "../../../components/Layout/InformationLayout/InformationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {
  soloBowlerInfoAdded
} from "../../../store/actions/registrationActions";
import {devConsoleLog, useTheTournament} from "../../../utils";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import TournamentHeader from "../../../components/ui/TournamentHeader";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  devConsoleLog("------------ page untouched in team restoration");
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier} = router.query;

  const {loading, tournament} = useTheTournament(identifier);

  useEffect(() => {
    if (!identifier || !tournament) {
      return;
    }
    if (!tournament.registrationOptions.solo) {
      router.push(`/tournaments/${identifier}`);
    }
  }, [tournament]);

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Getting the registration form ready'}/>
      </div>
    );
  }

  /////////////////////////////////////

  const bowlerInfoSaved = (bowlerData) => {
    dispatch(soloBowlerInfoAdded(bowlerData));
    router.push({
      pathname: '/tournaments/[identifier]/solo-bowler-review',
      query: {
        identifier: identifier,
      }
    });
  }

  const previousBowlerData = registration.bowler ? registration.bowler : null;
  const askBowlerAboutShifts = tournament.shifts.length > 1;

  return (
    <div>
      <TournamentHeader tournament={tournament}/>

      <h2 className={`bg-primary-subtle py-3`}>
        Solo Registration
      </h2>

      <BowlerForm tournament={tournament}
                  bowlerData={previousBowlerData}
                  bowlerInfoSaved={bowlerInfoSaved}
                  showShifts={askBowlerAboutShifts}
      />

    </div>
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
