import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationInitiated, newTeamRegistrationUpdated} from "../../../store/actions/registrationActions";
import {useEffect, useState} from "react";
import {useTheTournament} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import TournamentHeader from "../../../components/ui/TournamentHeader";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const ERRORS = [
    '',
    'Please name your team!',
    'Invalid shift preference specified',
  ];

  const {dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, message} = router.query;

  const {tournament, loading, error} = useTheTournament(identifier);
  const [errorMessage, setErrorMessage] = useState();

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!tournament) {
      return;
    }
    if (!tournament.registrationOptions.new_team) {
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
    <div className={`row`}>
      <div className={'col-12'}>
        <TournamentHeader tournament={tournament}/>

        <h2 className={``}>
          Create a Team
        </h2>
      </div>

      <div className={`col-md-8 offset-md-2`}>
        {errorMessage && (
          <>
              <ErrorAlert message={errorMessage} onClose={() => setErrorMessage(null)} />
              <hr/>
            </>
        )}

        <TeamForm tournament={tournament}
                  onSubmit={teamFormCompleted} />
      </div>
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
