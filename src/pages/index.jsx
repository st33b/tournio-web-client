import FrontLayout from '../components/Layout/FrontLayout/FrontLayout';
import Front from "../components/Front/Front";

const IndexPage = () => {
  return (
    <Front/>
  );
}

IndexPage.getLayout = function getLayout(page) {
  return (
    <FrontLayout>
      {page}
    </FrontLayout>
  );
}

export default IndexPage;
