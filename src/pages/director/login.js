import DirectorLayout from '../../components/Layout/DirectorLayout/DirectorLayout';
import LoginForm from '../../components/LoginForm/LoginForm';

const login = () => {
  return (
    <div>
      <LoginForm />
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