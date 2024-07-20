import {useEffect} from "react";
import {useRouter} from "next/router";

import InformationLayout from "../../../components/Layout/InformationLayout/InformationLayout";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {
  soloBowlerInfoAdded
} from "../../../store/actions/registrationActions";
import {useTheTournament} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../components/common/ErrorAlert";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import Link from "next/link";
import Sidebar from "../../../components/Registration/Sidebar/Sidebar";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import DumbBowlerForm from "../../../components/Registration/DumbBowlerForm/DumbBowlerForm";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;

  const {loading, tournament, error} = useTheTournament(identifier);

  useEffect(() => {
    if (!identifier || !tournament) {
      return;
    }
    if (!tournament.registrationOptions.solo) {
      router.push(`/tournaments/${identifier}`);
    }
  }, [tournament]);

  if (error) {
    return (
      <div>
        <ErrorAlert message={error}/>
      </div>
    );
  }

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Getting the registration form ready'}/>
      </div>
    );
  }

  /////////////////////////////////////

  const bowlerInfoSaved = (bowlerData) => {
    dispatch(soloBowlerInfoAdded(bowlerData));
    router.push({
      pathname: '/tournaments/[identifier]/solo-bowler-review',
      query: {
        identifier: identifier,
      }
    });
  }

  const bowlerData = edit && registration.bowler ? registration.bowler : null;
  const titleText = edit ? 'Edit Bowler Details' : 'Bowler Registration';
  const buttonText = edit ? 'Save Changes' : 'Next';

  let preferredShiftNames = [];
  if (registration.bowler && registration.bowler.shiftIdentifiers) {
    preferredShiftNames = registration.bowler.shiftIdentifiers.map(identifier =>
      tournament.shifts.find(shift => shift.identifier === identifier).name
    );
  }

  const fieldNames = [
    'firstName',
    'lastName',
    'nickname',
    'email',
    'phone',
  ].concat(tournament.config['bowler_form_fields'].split(' ').map(serverField => {
    switch (serverField) {
      case 'postal_code':
        return 'postalCode';
      case 'usbc_id':
        return 'usbcId';
      case 'date_of_birth':
        return 'dateOfBirth';
      case 'payment_app':
        return 'paymentApp';
      default:
        return serverField;
    }
  })).concat(tournament.additionalQuestions.map(q => q.name));

  // Future improvement: merge the concepts of "bowler form fields" and "additional questions"

  const fieldData = {
    shiftIdentifiers: {
      value: [],
      options: [],
    },
  }
  if (tournament.shifts.length === 1) {
    fieldData.shiftIdentifiers.value = [tournament.shifts[0].identifier];
  } else {
    // fieldNames.push('shiftIdentifiers');
    fieldData.shiftIdentifiers.options = tournament.shifts.map(({identifier, name, description}) => {
      return {
        value: identifier,
        label: `${name} (${description}`,
      };
    });
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
                   shiftPreferences={preferredShiftNames}
                   bowler={bowlerData}
                   />
        </div>

        <div className={'col-12 col-md-8'}>
          <ProgressIndicator steps={['bowler', 'review']}
                             active={'bowler'}/>
          <DumbBowlerForm tournament={tournament}
                          bowler={bowlerData}
                          solo={true}
                          onBowlerSave={bowlerInfoSaved}
                          submitButtonText={buttonText}
                          fieldNames={fieldNames}
                          fieldData={fieldData}/>

          {/*<BowlerForm tournament={tournament}*/}
          {/*            bowlerInfoSaved={bowlerInfoSaved}*/}
          {/*            bowlerData={bowlerData}*/}
          {/*            solo={true}*/}
          {/*            nextButtonText={buttonText}/>*/}
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
