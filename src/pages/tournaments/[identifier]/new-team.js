import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationInitiated} from "../../../store/actions/registrationActions";
import {useEffect} from "react";
import {useTournament} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import TournamentHeader from "../../../components/ui/TournamentHeader";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const {dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;

  const {tournament, loading, error} = useTournament(identifier);

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!tournament) {
      return;
    }
    if (!tournament.registration_options.new_team) {
      router.push(`/tournaments/${tournament.identifier}`);
    }
  }, [tournament]);

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Loading the tournament'}/>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <ErrorAlert message={error}/>
      </div>
    );
  }

  ///////////////////////////////////////////

  const teamFormCompleted = (formData) => {
    dispatch(newTeamRegistrationInitiated(formData));
    router.push(`/tournaments/${identifier}/new-team-first-bowler`);
  }

  return (
    <div className={`col-md-8 offset-md-2`}>
      <TournamentHeader tournament={tournament}/>

      <h2 className={`text-center flex-grow-1`}>
        Create a Team
      </h2>

      <hr />

      <TeamForm shifts={tournament.shifts}
                maxBowlers={tournament.team_size}
                onSubmit={teamFormCompleted} />
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
