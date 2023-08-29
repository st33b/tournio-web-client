import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationInitiated} from "../../../store/actions/registrationActions";
import {useEffect} from "react";
import {devConsoleLog, useClientReady} from "../../../utils";
import Link from "next/link";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!registration.tournament) {
      return;
    }
    if (!registration.tournament.registration_options.new_team) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
    }
  }, [registration]);

  const ready = useClientReady();
  if (!ready || !registration.tournament) {
    return (
      <div>
        <p>
          So, this is a placeholder. Enjoy while we load stuff.
        </p>
      </div>
    )
  }

  ///////////////////////////////////////////

  const teamFormCompleted = (formData) => {
    devConsoleLog('Ready to dispatch team data and get the first bowler details');
    // dispatch(newTeamRegistrationInitiated(formData));
  }

  return (
    <div>
      <div className={`display-2 text-center mt-3`}>
        {registration.tournament.abbreviation} {registration.tournament.year}
      </div>

      <hr />

      <h2 className={`text-center flex-grow-1`}>
        Create a Team
      </h2>

      <hr />

      <TeamForm shifts={registration.tournament.shifts}
                maxBowlers={registration.tournament.team_size}
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
