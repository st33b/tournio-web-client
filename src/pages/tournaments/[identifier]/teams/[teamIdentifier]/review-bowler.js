import {useRouter} from "next/router";

import InformationLayout from "../../../../../components/Layout/InformationLayout/InformationLayout";
import {useRegistrationContext} from "../../../../../store/RegistrationContext";
import React, {useState} from "react";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import Link from "next/link";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import {devConsoleLog, submitAddBowler, useTheTournament} from "../../../../../utils";
import BowlerSummary from "../../../../../components/Registration/ReviewEntries/BowlerSummary";
import {existingTeamBowlerSaved} from "../../../../../store/actions/registrationActions";
import TournamentLogo from "../../../../../components/Registration/TournamentLogo/TournamentLogo";
import Sidebar from "../../../../../components/Registration/Sidebar/Sidebar";
import ProgressIndicator from "../../../../../components/Registration/ProgressIndicator/ProgressIndicator";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, teamIdentifier} = router.query;

  const [processing, setProcessing] = useState(false);

  const {loading, tournament, error} = useTheTournament(identifier);

  if (!registration || !tournament || !registration.bowler || !registration.team) {
    return <LoadingMessage message={'Getting things ready...'}/>
  }

  if (loading) {
    return <LoadingMessage message={'Getting things ready...'}/>
  }

  if (error) {
    devConsoleLog("Error:", error);
    return (
      <div>
        <ErrorAlert message={'Something went wrong.'}/>
      </div>
    );
  }

  ////////////////////////////////////////

  const addBowlerSuccess = (bowlerData) => {
    // add the bowler to the team's bowlers, then call teamHasChanged and dispatch.
    team.bowlers = team.bowlers.concat(bowlerData);
    teamHasChanged(team);
    dispatch(existingTeamBowlerSaved(team));
    setProcessing(false);
    router.push({
      pathname: '/tournaments/[identifier]/teams/[teamIdentifier]',
      query: {
        identifier: identifier,
        teamIdentifier: teamIdentifier,
      }
    });
  }

  const addBowlerFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const saveClicked = () => {
    // Write the bowler to the backend, with the single bowler.
    // Upon success, redirect to the team's page, which will
    // present its options.
    // submitAddBowler({
    //   tournament: tournament,
    //   team: team,
    //   bowler: registration.bowler,
    //   onSuccess: addBowlerSuccess,
    //   onFailure: addBowlerFailure,
    // });
    // setProcessing(true);
  }

  // let doublesPartner = null;
  // if (registration.bowler.doubles_partner) {
  //   doublesPartner = team.bowlers.find(bowler => registration.bowler.doubles_partner === bowler.identifier);
  // }

  const fieldNames = [
    'position',
    'firstName',
    'nickname',
    'lastName',
    'email',
    'phone',
  ].concat(tournament.config['bowler_form_fields'].split(' ')).concat(tournament.additionalQuestions.map(q => q.name));

  return (
    <>
      <div className={'row d-flex d-md-none'}>
        <div className={'col-5'}>
          <TournamentLogo url={tournament.imageUrl} additionalClasses={'mb-2'}/>
        </div>
        <p className={'col-7 display-4 align-self-center'}>
          Review Bowler Details
        </p>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-4'}>

          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
            <p className={'col display-5'}>
              Review Bowler Details
            </p>
          </div>

          <Sidebar tournament={tournament}
                   teamName={registration.team.name}
                   bowlers={registration.team.bowlers}
          />
        </div>

        <div className={'col-12 col-md-8'}>
          <ProgressIndicator steps={['bowler', 'review']}
                             completed={['bowler']}
                             active={'review'}/>

          <div className={'alert alert-warning'}>
            Please check everything to make sure it&apos;s correct, and make any necessary changes. If everything looks
            good, hit the big{' '}
            <span className={'fw-bolder'}>
              Finish
            </span>
            {' '}button at the bottom.
          </div>

          <BowlerSummary tournament={tournament}
                         fieldNames={fieldNames}
                         bowler={registration.bowler}
                         // partner={partner}
          />

          <div className={'d-flex justify-content-between py-3'}>
            <div className={'text-start'}>
              <Link href={
                {
                  pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/add-bowler',
                  query: {
                    identifier: identifier,
                    teamIdentifier: teamIdentifier,
                    edit: true,
                    position: registration.bowler.position,
                  },
                }}
                    className={'btn btn-secondary'}>
                <i className={'bi bi-chevron-double-left pe-2'} aria-hidden={true} />
                Make Changes
              </Link>
            </div>
            <div className={'text-end'}>
              <button className={'d-block btn btn-lg btn-primary'}
                      disabled={processing}
                      onClick={saveClicked}
              >
                Finish
                <i className={'bi bi-chevron-double-right ps-2'} aria-hidden={true}/>
              </button>
            </div>
          </div>


        </div>
      </div>
    </>
    // <div>
    //   <TournamentHeader tournament={tournament}/>
    //
    //   <h2 className={`bg-primary-subtle py-3`}>
    //     Review Bowler Details
    //   </h2>
    //
    //   <h4 className={``}>
    //     Team:&nbsp;
    //     <strong>
    //       {team.name}
    //     </strong>
    //   </h4>
    //
    //   <hr/>
    //
    //   <div className={''}>
    //     <BowlerSummary bowler={registration.bowler}
    //                    tournament={tournament}
    //                    partner={doublesPartner}/>
    //
    //     <hr/>
    //
    //     {error && <ErrorAlert message={error}/>}
    //
    //     <div className={`d-flex justify-content-between`}>
    //       <Link href={{
    //         pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/add-bowler',
    //         query: {
    //           identifier: identifier,
    //           teamIdentifier: teamIdentifier,
    //           edit: true,
    //         }
    //       }}
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
    <InformationLayout>
      {page}
    </InformationLayout>
  );
}

export default Page;
