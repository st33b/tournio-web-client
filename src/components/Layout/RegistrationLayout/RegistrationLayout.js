import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import Footer from './Footer';
import classes from './RegistrationLayout.module.scss';
import MaintenanceAnnouncement from "../../common/MaintenanceAnnouncement/MaintenanceAnnouncement";
import {RegistrationContextProvider} from "../../../store/RegistrationContext";

const RegistrationLayout = ({children}) => {
  return (
    <RegistrationContextProvider>
      <div className={classes.RegistrationLayout}>
        <SiteHeader/>
        <header>
          <Container fluid={'lg'}>
            <Navigation/>
          </Container>
        </header>

        <main>
          <Container fluid={'lg'}>
            <MaintenanceAnnouncement/>
            {children}
          </Container>
        </main>

        <footer>
          <Container fluid={'lg'}>
            <Footer/>
          </Container>
        </footer>
      </div>
    </RegistrationContextProvider>
  )
}

export default RegistrationLayout;
