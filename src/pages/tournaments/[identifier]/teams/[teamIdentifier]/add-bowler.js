import {useRegistrationContext} from "../../../../../store/RegistrationContext";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {devConsoleLog, useTeam, useTheTournament} from "../../../../../utils";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import InformationLayout from "../../../../../components/Layout/InformationLayout/InformationLayout";
import TournamentHeader from "../../../../../components/ui/TournamentHeader";
import PositionChooser from "../../../../../components/common/formElements/PositionChooser/PositionChooser";
import BowlerForm from "../../../../../components/Registration/BowlerForm/BowlerForm";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import {existingTeamBowlerInfoAdded} from "../../../../../store/actions/registrationActions";
import Link from "next/link";
import TournamentLogo from "../../../../../components/Registration/TournamentLogo/TournamentLogo";
import Sidebar from "../../../../../components/Registration/Sidebar/Sidebar";
import ProgressIndicator from "../../../../../components/Registration/ProgressIndicator/ProgressIndicator";
import DumbBowlerForm from "../../../../../components/Registration/DumbBowlerForm/DumbBowlerForm";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, teamIdentifier, position = 1, edit} = router.query;

  const {loading, team, error: fetchError } = useTeam(teamIdentifier);
  const {tournament, error: tournamentError} = useTheTournament(identifier);

  if (!registration || !tournament) {
    return <LoadingMessage message={'Getting things ready...'}/>
  }

  if (loading) {
    return <LoadingMessage message={'Getting things ready...'}/>
  }

  if (fetchError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load team.'}/>
      </div>
    );
  }

  if (tournamentError) {
    return (
      <div>
        <ErrorAlert message={'Failed to load tournament.'}/>
      </div>
    );
  }

  //////////////////////

  const bowlerInfoSaved = (bowlerData) => {
    const completeBowlerData = {...bowlerData};
    completeBowlerData.position = position;

    dispatch(existingTeamBowlerInfoAdded(team, completeBowlerData));
    router.push({
      pathname: '/tournaments/[identifier]/teams/[teamIdentifier]/review-bowler',
      query: {
        identifier: identifier,
        teamIdentifier: teamIdentifier,
      }
    });
  }

  const bowlerData = edit && registration.bowler ? registration.bowler : null;
  const titleText = edit ? 'Edit Bowler Details' : 'Add a Bowler To a Team';
  const buttonText = edit ? 'Save Changes' : 'Next';

  const fieldNames = [
    'position',
    'firstName',
    'nickname',
    'lastName',
    'email',
    'phone',
  ].concat(tournament.config['bowler_form_fields'].split(' ')).concat(tournament.additionalQuestions.map(q => q.name));

  const fieldData = {
    position: {
      elementType: 'readonly',
      elementConfig: {
        value: position,
        choices: [],
      }
    }
  }

  return (
    <>
      <div className={'row d-flex d-md-none'}>
        <div className={'col-5'}>
          <TournamentLogo url={tournament.imageUrl} additionalClasses={'mb-2'}/>
        </div>
        <p className={'col-7 display-4 align-self-center'}>
          {titleText}
        </p>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-4'}>

          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
            <p className={'col display-5'}>
              {titleText}
            </p>
          </div>

          <Sidebar tournament={tournament}
                   teamName={team.name}
                   bowlers={team.bowlers}
          />
        </div>

        <div className={'col-12 col-md-8'}>
          <ProgressIndicator steps={['bowler', 'review']}
                             active={'bowler'}/>
          <DumbBowlerForm tournament={tournament}
                          bowler={bowlerData}
                          onBowlerSave={bowlerInfoSaved}
                          submitButtonText={buttonText}
                          fieldNames={fieldNames}
                          fieldData={fieldData}
          />
        </div>
      </div>
    </>
    // <div>
    //   <TournamentHeader tournament={tournament}/>
    //
    //   <h2 className={`bg-primary-subtle py-3`}>
    //     Add a Bowler
    //   </h2>
    //
    //   <h3 className={''}>
    //     Team:&nbsp;
    //     <strong>
    //       <Link href={{
    //         pathname: '/tournaments/[identifier]/teams/[teamIdentifier]',
    //         query: {
    //           identifier: identifier,
    //           teamIdentifier: team.identifier,
    //         }
    //       }}>
    //         {team.name}
    //       </Link>
    //     </strong>
    //   </h3>
    //
    //   <div className={''}>
    //     <PositionChooser maxPosition={tournament.config['team_size']}
    //                      chosen={chosenPosition}
    //                      onChoose={choosePosition}
    //                      disallowedPositions={unavailablePositions}
    //     />
    //
    //     <BowlerForm tournament={tournament}
    //                 bowlerData={previousBowlerData}
    //                 availablePartners={availableDoublesPartners}
    //                 bowlerInfoSaved={bowlerInfoSaved}/>
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
