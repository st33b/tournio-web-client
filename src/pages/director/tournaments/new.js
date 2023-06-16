import {useRouter} from "next/router";

import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import {useLoggedIn} from "../../../director";
import TournamentBuilder from "../../../components/Director/TournamentBuilder/TournamentBuilder";
import {useLoginContext} from "../../../store/LoginContext";

const Page = () => {
  const router = useRouter();
  const {ready} = useLoginContext();

  if (!ready) {
    return '';
  }

  const {step} = router.query;

  const SUPPORTED_STEPS = [
    'name',
    'details',
    'dates',
    'logo',
    'scoring',
    'required_events',
    'additional_events',
    'derived_events',
  ];

  let activeStep = '';
  if (step) {
    if (SUPPORTED_STEPS.includes(step)) {
      activeStep = step;
    } else {
      activeStep = 'name';
    }
  }

  return (
    <div>
      <TournamentBuilder step={activeStep}/>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Page;
