import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationInitiated, newTeamRegistrationUpdated} from "../../../store/actions/registrationActions";
import {useEffect, useState} from "react";
import {devConsoleLog, useTournament} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import TournamentHeader from "../../../components/ui/TournamentHeader";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const ERRORS = [
    '',
    'Please name your team!',
    'Requested shift is full',
  ];

  const {dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, message} = router.query;

  const {tournament, loading, error} = useTournament(identifier);
  const [errorMessage, setErrorMessage] = useState();

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!tournament) {
      return;
    }
    if (!tournament.registration_options.new_team) {
      router.push(`/tournaments/${tournament.identifier}`);
    }

    // Did we get sent here because of a validation failure?
    if (message) {
      const index = parseInt(message);
      if (index > 0) {
        setErrorMessage(ERRORS[index]);
      }
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
    const queryParams = {
      identifier: identifier,
    };
    if (message) {
      queryParams.edit = true;
      dispatch(newTeamRegistrationUpdated(formData));
    } else {
      dispatch(newTeamRegistrationInitiated(formData));
    }

    router.push({
      pathname: '/tournaments/[identifier]/new-team-first-bowler',
      query: queryParams,
    });
  }

  return (
    <div className={`col-md-8 offset-md-2`}>
      <TournamentHeader tournament={tournament}/>

      <h2 className={`text-center flex-grow-1`}>
        Create a Team
      </h2>

      <hr />

      {errorMessage && (
          <>
            <ErrorAlert message={errorMessage} onClose={() => setErrorMessage(null)} />
            <hr/>
          </>
      )}

      <TeamForm tournament={tournament}
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
