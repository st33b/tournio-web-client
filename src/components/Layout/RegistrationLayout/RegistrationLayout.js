import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import Footer from './Footer';
import classes from './RegistrationLayout.module.scss';
import MaintenanceAnnouncement from "../../common/MaintenanceAnnouncement/MaintenanceAnnouncement";

const RegistrationLayout = ({children, showCart}) => {
  return (
    <div className={classes.RegistrationLayout}>
      <SiteHeader/>
      <header>
        <Container fluid={'md'}>
          <Navigation showCart={showCart}/>
        </Container>
      </header>

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

export default RegistrationLayout;
