import RegistrationLayout from '../components/Layout/RegistrationLayout/RegistrationLayout';
import About from "../components/About/About";

const Page = () => (
  <About />
)

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;