import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {useClientReady} from "../../../utils";
import {useEffect, useState} from "react";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import NewTeamReview from "../../../components/Registration/NewTeamReview/NewTeamReview";
import Link from "next/link";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!registration || !registration.tournament) {
      return;
    }
    if (!registration.tournament.registration_options.new_team) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
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
        <LoadingMessage message={'Putting everything together...'}/>
      </div>
    );
  }

  const editBowlerClicked = () => {
    router.push(`/tournaments/${registration.tournament.identifier}/new-team-first-bowler`);
  }

  const saveClicked = () => {
    // Write the team to the backend, with the single bowler.
    // Upon success, redirect to the team's page, which will
    // present its options.

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

  return (
    <div>
      <div className={`display-2 text-center mt-3`}>
        {registration.tournament.abbreviation} {registration.tournament.year}
      </div>

      <hr />

      <NewTeamReview team={registration.team}
                     bowler={registration.bowler}
                     onEdit={editBowlerClicked}
                     onSave={saveClicked}/>

      <hr />

      <div className={`d-flex justify-content-between`}>
        <Link href={`/tournaments/${registration.tournament.identifier}/new-team-first-bowler?edit=true`}
              className={`btn btn-lg btn-outline-primary d-block`}>
          <i className={'bi bi-chevron-double-left pe-2'}
             aria-hidden={true}/>
          Make Changes
        </Link>

        <button className={`btn btn-lg btn-primary`}
                onClick={saveClicked}>
          Save
          <i className={'bi bi-chevron-double-right ps-2'}
             aria-hidden={true}/>
        </button>
      </div>
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
