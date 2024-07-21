import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import InformationLayout from "../../../components/Layout/InformationLayout/InformationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {soloBowlerRegistrationCompleted} from "../../../store/actions/registrationActions";
import {submitSoloRegistration, useTheTournament} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import Link from "next/link";
import BowlerSummary from "../../../components/Registration/ReviewEntries/BowlerSummary";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier} = router.query;

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const {loading, tournament, error: tournamentError} = useTheTournament(identifier);

  useEffect(() => {
    if (!identifier || !tournament) {
      return;
    }
    if (!tournament.registrationOptions.solo) {
      router.push(`/tournaments/${identifier}`);
    }
  }, [registration]);

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Putting everything together...'}/>
      </div>
    );
  }

  const soloRegistrationSuccess = (bowler) => {
    dispatch(soloBowlerRegistrationCompleted());
    setProcessing(false);
    router.push({
      pathname: '/bowlers/[identifier]',
      query: {
        identifier: bowler.identifier,
        success: 1,
      }
    })
  }

  const soloRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const saveClicked = () => {
    // Write the bowler to the backend.
    // Upon success, redirect to the bowler's page, which will
    // present its payment/extras button
    submitSoloRegistration(tournament,
      registration.bowler,
      soloRegistrationSuccess,
      soloRegistrationFailure);
    setProcessing(true);
  }

  const fieldNames = [
    'firstName',
    'lastName',
    'nickname',
    'email',
    'phone',
  ].concat(tournament.config['bowler_form_fields'].split(' '));
  // not appending the additional question names, since the summary pulls the labels directly from the tournament

  return (
    <>
      <div className={'row d-flex d-md-none'}>
        <div className={'col-5'}>
          <TournamentLogo url={tournament.imageUrl} additionalClasses={'mb-2'}/>
        </div>
        <p className={'col-7 display-4 align-self-center'}>
          Let&apos;s Review...
        </p>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-4'}>

          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
            <p className={'col display-5'}>
              Let&apos;s Review...
            </p>
          </div>
        </div>

        <div className={'col-12 col-md-8'}>
          <ProgressIndicator steps={['bowler', 'review']}
                             completed={['bowler']}
                             active={'review'}/>

          <div className={'alert alert-warning'}>
            Please check everything to make sure it&apos;s correct, and make any necessary changes. If everything looks
            good, hit the big{' '}
            <span className={'fw-bolder'}>
              Submit Registration
            </span>
            {' '}button at the bottom.
          </div>

          {tournamentError && <ErrorAlert message={tournamentError}/> }

          {/* bowler details */}
          <div className={'mb-4'}>
            <BowlerSummary tournament={tournament}
                           fieldNames={fieldNames}
                           bowler={registration.bowler}
                           labelClass={'col-5'}
            />
          </div>

          <div className={`row`}>
            <div className={'col-12 col-md-6 mb-3'}>
              <Link href={`/tournaments/${tournament.identifier}/solo-bowler?edit=true`}
                    className={'btn btn-secondary'}>
                <i className="bi bi-chevron-double-left pe-1" aria-hidden="true"/>
                Make Changes
              </Link>
            </div>

            <div className={'col-12 col-md-6 text-end'}>
              <button className={'btn btn-lg btn-primary'}
                      onClick={saveClicked}
                      disabled={processing}>
                Submit Registration
                <i className="bi bi-chevron-double-right ps-1" aria-hidden="true"/>
              </button>
              {processing && (
                <button className={'btn btn-lg btn-outline-primary'}
                        onClick={() => {
                        }}
                        disabled={true}>
                  Submitting...
                  <i className="bi bi-chevron-double-right ps-1" aria-hidden="true"/>
                </button>
              )}
            </div>

            {error && <ErrorAlert message={error}/> }
          </div>
        </div>
      </div>
    </>
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
