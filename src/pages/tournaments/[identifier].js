import {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {retrieveTournamentDetails} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";

const page = () => {
  const router = useRouter();
  const { entry, dispatch, commerceDispatch } = useRegistrationContext();
  const { identifier } = router.query;

  // fetch the tournament details and put the tournament into context
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    retrieveTournamentDetails(identifier, dispatch, commerceDispatch);
   }, [identifier]);

  if (!entry || !entry.tournament) {
    return (
      <div>
        <p>
          Retrieving tournament details...
        </p>
      </div>
    );
  }

  return <TournamentDetails tournament={entry.tournament} />;
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;