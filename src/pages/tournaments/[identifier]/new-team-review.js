import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {devConsoleLog, submitNewTeamWithPlaceholders, useTheTournament} from "../../../utils";
import React, {useEffect, useState} from "react";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import NewTeamReview from "../../../components/Registration/NewTeamReview/NewTeamReview";
import Link from "next/link";
import {newTeamEntryCompleted} from "../../../store/actions/registrationActions";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerSummary from "../../../components/Registration/ReviewEntries/BowlerSummary";
import SuccessAlert from "../../../components/common/SuccessAlert";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, successIndex} = router.query;

  const [processing, setProcessing] = useState(true);
  const {loading: tournamentLoading, tournament, error: tournamentError} = useTheTournament(identifier);

  // If new-team registrations isn't enabled, go back to the tournament home page
  useEffect(() => {
    if (!identifier || !registration || !tournament) {
      return;
    }
    if (!tournament.registrationOptions.new_team) {
      router.push(`/tournaments/${identifier}`);
    }
  }, [identifier, registration]);

  if (tournamentLoading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Putting everything together...'}/>
      </div>
    );
  }

  const newTeamRegistrationSuccess = (teamData) => {
    dispatch(newTeamEntryCompleted(teamData));
    setProcessing(false);
    router.push({
      pathname: '/tournaments/[identifier]/teams/[teamIdentifier]',
      query: {
        identifier: identifier,
        teamIdentifier: teamData.identifier,
      }
    });
  }

  const newTeamRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    if (errorMessage.team) {
      // back to team info
      router.push({
        pathname: '/tournaments/[identifier]/new-team',
        query: {
          identifier: identifier,
          message: 2,
        }
      });
    } else if (errorMessage.bowler) {
      // back to bowler info
      router.push({
        pathname: '/tournaments/[identifier]/new-team-first-bowler',
        query: {
          identifier: identifier,
          edit: true,
        }
      });
    }
  }

  const saveClicked = () => {
    // Write the team to the backend, with the single bowler.
    // Upon success, redirect to the team's page, which will
    // present its options.
    // submitNewTeamWithPlaceholders({
    //   tournament: tournament,
    //   team: registration.team,
    //   bowler: registration.bowler,
    //   onSuccess: newTeamRegistrationSuccess,
    //   onFailure: newTeamRegistrationFailure,
    // });
    setProcessing(true);
  }

  if (!registration.team) {
    return '';
  }

  const completedSteps = ['team', 'bowlers'];
  if (tournament.events.some(({rosterType}) => rosterType === 'double')) {
    completedSteps.push('doubles');
  }

  let preferredShiftNames = [];
  if (registration.team.shiftIdentifiers) {
    preferredShiftNames = registration.team.shiftIdentifiers.map(identifier =>
      tournament.shifts.find(shift => shift.identifier === identifier).name
    );
  }

devConsoleLog("Success index:", successIndex);

  return (
    <>
      <div className={'row d-md-none'}>
        <div className={'col-5'}>
          <Link href={`/tournaments/${identifier}`}>
            <TournamentLogo url={tournament.imageUrl} additionalClasses={'mb-2'}/>
          </Link>
        </div>
        <p className={'col display-4'}>
          Let&apos;s Review...
        </p>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-2'}>
          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
          </div>
        </div>

        <div className={'col-12 col-md-10'}>
          <ProgressIndicator completed={completedSteps} active={'review'}/>
          <p className={'d-none d-md-block display-5'}>
            Let&apos;s Review...
          </p>
          <div className={'alert alert-warning'}>
            Please check everything to make sure it&apos;s correct, and make any necessary changes. If everything looks good, hit the big{' '}
            <span className={'fw-bolder'}>
              Submit Registration
            </span>
            {' '}button at the bottom.
          </div>

          {/* team details */}
          <NewTeamReview tournament={tournament} team={registration.team}/>

          {/* bowler details */}
          {registration.team.bowlers.map((bowler, i) => {
            const index = bowler.doublesPartnerIndex;
            const partner = index >= 0 ? registration.team.bowlers[index] : null;
            return (
              <div key={`summary_${i}`} className={'mb-4'}>
                <div className={'d-flex align-items-baseline'}>
                  <h5>
                    Bowler {bowler.position}
                  </h5>
                  <Link href={
                    {
                      pathname: '/tournaments/[identifier]/new-team-bowler',
                      query: {
                        identifier: identifier,
                        edit: true,
                        index: i,
                      },
                    }}
                        className={'d-block ps-3'}>
                    (edit)
                  </Link>
                </div>
                <BowlerSummary tournament={tournament}
                               bowler={bowler}
                               partner={partner}/>

                {successIndex == i && (
                  <SuccessAlert message={'Bowler details updated!'}/>
                )}
              </div>
            )
          })}

          <div className={'text-end'}>
            <button className={'btn btn-lg btn-primary'}
                    onClick={saveClicked}
                    disabled={processing}>
              Submit Registration
            </button>
          </div>
        </div>
      </div>
    </>
    // <div className={'row'}>
    //   <div className={'col-12'}>
    //     <TournamentHeader tournament={tournament}/>
    //
    //     <h3 className={`bg-primary-subtle py-3`}>
    //       Initial Review
    //     </h3>
    //
    //   </div>
    //
    //   <div className={'col-md-10 offset-md-1 col-lg-8 offset-lg-2'}>
    //   <NewTeamReview team={registration.team}
    //                    bowler={registration.bowler}
    //                    tournament={tournament}
    //                    onEdit={editBowlerClicked}
    //                    onSave={saveClicked}/>
    //
    //     <hr/>
    //
    //     <div className={`d-flex justify-content-between`}>
    //       <Link href={`/tournaments/${identifier}/new-team-first-bowler?edit=true`}
    //             className={`btn btn-lg btn-outline-primary d-block ${processing && 'invisible'}`}>
    //         <i className={'bi bi-chevron-double-left pe-2'}
    //            aria-hidden={true}/>
    //         Make Changes
    //       </Link>
    //
    //       <button className={`btn btn-lg btn-primary`}
    //               disabled={processing}
    //               onClick={saveClicked}>
    //         Save
    //         <i className={'bi bi-chevron-double-right ps-2'}
    //            aria-hidden={true}/>
    //       </button>
    //     </div>
    //
    //     {processing && <LoadingMessage message={'Submitting registration...'}/>}
    //   </div>
    // </div>
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
