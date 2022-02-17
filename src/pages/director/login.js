// The top-level page for bowlers

import DirectorLayout from '../../components/Layout/DirectorLayout/DirectorLayout';

const login = () => {
  return (
    <div>
      <p>Login page content!</p>
    </div>
  );
}

login.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default login;