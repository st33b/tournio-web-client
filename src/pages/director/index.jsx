// The top-level page for directors

import DirectorLayout from "../../components/Layout/DirectorLayout/DirectorLayout";

const page = () => {
  return (
    <div>
      <p>Director index page content!</p>
    </div>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default page;