import RegistrationLayout from '../components/Layout/RegistrationLayout/RegistrationLayout';
import About from "../components/About/About";

const page = () => (
  <About />
)

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;