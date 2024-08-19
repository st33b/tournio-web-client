import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import Footer from './Footer';
import classes from './InformationLayout.module.scss';
import MaintenanceAnnouncement from "../../common/MaintenanceAnnouncement/MaintenanceAnnouncement";
import {RegistrationContextProvider} from "../../../store/RegistrationContext";

const InformationLayout = ({children}) => {
  return (
    <RegistrationContextProvider>
      <div className={classes.InformationLayout}>
        <SiteHeader/>
        <header>
          <Container fluid={'md'}>
            <Navigation/>
          </Container>
        </header>

        <main>
          <Container fluid={'md'}>
            <MaintenanceAnnouncement/>
            {children}
          </Container>
        </main>

        <footer>
          <Container fluid={'md'}>
            <Footer/>
          </Container>
        </footer>
      </div>
    </RegistrationContextProvider>
  )
}

export default InformationLayout;
