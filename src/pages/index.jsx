// The top-level page for bowlers

import RegistrationLayout from '../components/Layout/RegistrationLayout/RegistrationLayout';

const page = () => {
  return (
    <div>
      <p>Registration index page content!</p>
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