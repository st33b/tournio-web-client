import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import Footer from './Footer';
import classes from './RegistrationLayout.module.scss';

const registrationLayout = ({children, cart}) => {
  return (
    <div className={classes.RegistrationLayout}>
      <SiteHeader/>
      <header>
        <Container fluid={'md'}>
          <Navigation cart={cart}/>
        </Container>
      </header>

      <main>
        <Container fluid={'md'}>
          {children}
        </Container>
      </main>

      <Container fluid={'md'}>
        <Footer/>
      </Container>
    </div>
  )
}

export default registrationLayout;