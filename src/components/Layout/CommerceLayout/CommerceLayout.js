import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import Footer from './Footer';
import classes from './CommerceLayout.module.scss';
import MaintenanceAnnouncement from "../../common/MaintenanceAnnouncement/MaintenanceAnnouncement";
import {CommerceContextProvider} from "../../../store/CommerceContext";

const CommerceLayout = ({children}) => {
  return (
    <CommerceContextProvider>
      <div className={classes.CommerceLayout}>
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
    </CommerceContextProvider>
  )
}

export default CommerceLayout;
