// The top-level page for bowlers
import {useRouter} from "next/router";

import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";

const page = () => {
  const router = useRouter();
  const { identifier } = router.query;

  return (
    <div>
      <p>Tournament Registration page content!</p>
      <p>Identifier: {identifier}</p>
    </div>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;