import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import Footer from './Footer';
import MaintenanceAnnouncement from "../../common/MaintenanceAnnouncement/MaintenanceAnnouncement";

import classes from './DirectorLayout.module.scss';

const DirectorLayout = ({children}) => {
  return (
    <div className={classes.DirectorLayout}>
      <SiteHeader/>

      <header>
        <Container fluid={'lg'}>
          <Navigation/>
        </Container>
      </header>

      <main>
        <Container fluid={'lg'}>
          <MaintenanceAnnouncement />
          {children}
        </Container>
      </main>

      <footer>
        <Container fluid={'lg'}>
          <Footer/>
        </Container>
      </footer>
    </div>
  )
}

export default DirectorLayout;
