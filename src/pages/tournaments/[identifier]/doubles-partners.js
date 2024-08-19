import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {devConsoleLog, useTheTournament} from "../../../utils";

import React, {useEffect, useState} from "react";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {useRouter} from "next/router";
import {newTeamDoublesPartnersSaved} from "../../../store/actions/registrationActions";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../components/common/ErrorAlert";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import Link from "next/link";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import Sidebar from "../../../components/Registration/Sidebar/Sidebar";
import DoublesPartners from "../../../components/Registration/DoublesPartners/DoublesPartners";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;
  const {tournament, loading, error} = useTheTournament(identifier);
  const [bowlers, setBowlers] = useState([]);
  const [nextStepDisabled, setNextStepDisabled] = useState(true);

  useEffect(() => {
    if (!identifier || !registration.team) {
      return;
    }
    if (registration.team.bowlers.length < 2) {
      // no sense in assigning doubles when there's only one bowler
      router.push(`/tournaments/${identifier}/new-team-review`);
    }
    setNextStepDisabled(registration.team.bowlers.some(({doublesPartnerIndex}) => !doublesPartnerIndex));
  }, [identifier, registration.team])

  // When a doubles partner is clicked, what needs to happen:
  // - update the double partner assignments in state. (One click is enough to know everyone.)
  //  - Ex: Bowler A clicked on Bowler B
  //  - set A's partner to be B
  //  - set B's partner to be A (reciprocal)
  //  - set C and D to be partners (the remaining two)
  const gimmeNewDoublesPartners = (bowlerIndex, partnerIndex) => {
    // Try to prevent quickly clicking on Next Step after choosing partners.
    setNextStepDisabled(true);

    // create a copy of the bowlers array
    const newBowlers = registration.team.bowlers.slice(0);

    // Shouldn't happen, but just in case
    if (newBowlers[bowlerIndex].doublesPartnerIndex === partnerIndex) {
      devConsoleLog("Something ain't right, you're trying to partner someone up with themselves.");
      // Nothing is changing, so...
      return;
    }

    let bowlersLeftToUpdate = [...newBowlers.keys()];
    newBowlers[bowlerIndex].doublesPartnerIndex = partnerIndex;
    newBowlers[partnerIndex].doublesPartnerIndex = bowlerIndex;

    // Remove those two from the list of bowlers who need to be updated
    bowlersLeftToUpdate = bowlersLeftToUpdate.filter((value) => {
      return value !== bowlerIndex && value !== partnerIndex;
    });

    // Update the other two (if there are two) to be partners with each other
    if (bowlersLeftToUpdate.length > 1) {
      const left = bowlersLeftToUpdate[0];
      const right = bowlersLeftToUpdate[1];
      newBowlers[left].doublesPartnerIndex = right;
      newBowlers[right].doublesPartnerIndex = left;
    } else if (bowlersLeftToUpdate.length === 1) {
      // If there's just one left, then nullify their doubles partner selection
      newBowlers[bowlersLeftToUpdate[0]].doublesPartnerIndex = null;
    }

    setBowlers(newBowlers);
    setNextStepDisabled(false);
  }

  const savePartnersClicked = (e) => {
    e.preventDefault();

    // dispatch an action: new team doubles partners saved
    dispatch(newTeamDoublesPartnersSaved(bowlers));

    // push to review-entries
    devConsoleLog("Now we would push to review-entries");
  }

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Looking for the tournament...'}/>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ErrorAlert message={error}/>
      </div>
    );
  }

  if (!registration.team) {
    return '';
  }

  let preferredShiftNames = [];
  if (registration.team.shiftIdentifiers) {
    preferredShiftNames = registration.team.shiftIdentifiers.map(identifier =>
      tournament.shifts.find(shift => shift.identifier === identifier).name
    );
  }

  return (
    <>
      <div className={'row d-flex d-md-none'}>
        <p className={'display-3'}>
          {tournament.abbreviation} {tournament.year}
        </p>
        <ProgressIndicator completed={['team', 'bowlers']} active={'doubles'}/>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-4'}>

          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
          </div>

          <Sidebar tournament={tournament}
                   teamName={registration.team.name}
                   bowlers={registration.team.bowlers}
                   shiftPreferences={preferredShiftNames}/>

          <hr className={'d-md-none'}/>
        </div>

        <div className={'col-12 col-md-8'}>
          <div className={'d-none d-md-block'}>
            <ProgressIndicator completed={['team', 'bowlers']} active={'doubles'}/>
          </div>
          <p className={'d-md-none display-5'}>
            Doubles Partner Assignment
          </p>
          <p className={'d-none d-md-block display-6'}>
            Doubles Partner Assignment
          </p>

          <DoublesPartners bowlers={registration.team.bowlers} onPartnersChosen={gimmeNewDoublesPartners}/>

          <div className={'text-end'}>
            <p>
              <Link href={{
                pathname: '/tournaments/[identifier]/new-team-review',
                query: {
                  identifier: identifier,
                },
              }}
                    className={`btn btn-primary ${nextStepDisabled ? 'disabled' : ''}`}
                    aria-disabled={nextStepDisabled}
                    tabIndex={nextStepDisabled ? -1 : 0}
                    onChange={savePartnersClicked}
              >
                Next Step
                <i className="bi bi-chevron-double-right ps-1" aria-hidden="true"/>
              </Link>
            </p>
          </div>

          <div className={'text-end'}>
            <hr />
            <p className={'my-3'}>
              Prefer to skip this step?
              <br/>
              <span className={'small'}>({edit ? 'Changes will not be saved' : 'Doubles partners will not be assigned'}.)</span>
            </p>
            <p>
              <Link href={{
                pathname: '/tournaments/[identifier]/new-team-review',
                query: {
                  identifier: identifier,
                }
              }}
                    className={'btn btn-outline-primary'}>
                Go to Review
                <i className="bi bi-chevron-double-right ps-1" aria-hidden="true"/>
              </Link>
            </p>
          </div>
        </div>
      </div>


    </>
  )
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;
