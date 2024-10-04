import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import MaintenanceAnnouncement from "../../common/MaintenanceAnnouncement/MaintenanceAnnouncement";
import {DirectorContextProvider} from "../../../store/DirectorContext";
import {LoginContextProvider} from "../../../store/LoginContext";

import classes from './AdminLayout.module.scss';

const AdminLayout = ({children}) => {
  return (
    <LoginContextProvider>
      <DirectorContextProvider>
        <div className={classes.AdminLayout}>
          <SiteHeader/>

          <header>
            <Container fluid={'xxl'}>
              <Navigation/>
            </Container>
          </header>

          <main>
            <Container fluid={'xxl'}>
              <MaintenanceAnnouncement/>
              {children}
            </Container>
          </main>
        </div>
      </DirectorContextProvider>
    </LoginContextProvider>
  )
}

export default AdminLayout;
