import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Footer from './Footer';
import classes from './FrontLayout.module.scss';
import MaintenanceAnnouncement from "../../common/MaintenanceAnnouncement/MaintenanceAnnouncement";

const FrontLayout = ({children}) => {
  return (
    <div className={classes.FrontLayout}>
      <SiteHeader/>
      <main>
        <Container fluid={'md'}>
          <MaintenanceAnnouncement />
          {children}
        </Container>
      </main>

      <footer>
        <Container fluid={'md'}>
          <Footer/>
        </Container>
      </footer>
    </div>
  )
}

export default FrontLayout;