import {Container} from "react-bootstrap";
import {useState} from "react";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import Footer from './Footer';
import classes from './RegistrationLayout.module.scss';
import MaintenanceAnnouncement from "../../common/MaintenanceAnnouncement/MaintenanceAnnouncement";

const RegistrationLayout = ({children, showCart}) => {
  const [theme, setTheme] = useState({
    preferred: 'auto',
    active: 'light',
  })

  const updatePreferredColorTheme = (toTheme) => {
    let activeTheme = toTheme;
    if (toTheme === 'auto') {
      activeTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches ? 'dark' : 'light';
    }
    setTheme({
      preferred: toTheme,
      active: activeTheme,
    })
  }

  return (
    <div className={classes.RegistrationLayout} data-bs-theme={theme.active}>
      <SiteHeader/>
      <header>
        <Container fluid={'md'}>
          <Navigation showCart={showCart}
                      preferredTheme={theme.preferred}
                      activeTheme={theme.active}
                      onThemeChange={updatePreferredColorTheme} />
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
