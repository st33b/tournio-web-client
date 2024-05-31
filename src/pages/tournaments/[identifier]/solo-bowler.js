import {useEffect} from "react";
import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {
  soloBowlerInfoAdded
} from "../../../store/actions/registrationActions";
import {useTheTournament} from "../../../utils";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import TournamentHeader from "../../../components/ui/TournamentHeader";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
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
  // const askBowlerAboutShifts = tournament.config['tournament_type'] === 'single_event' && tournament.shifts.length > 1;
  const askBowlerAboutShifts = tournament.shifts.length > 1;

  return (
    <div>
      <TournamentHeader tournament={tournament}/>

      <h3 className={``}>
        Solo Registration
      </h3>

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
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;
