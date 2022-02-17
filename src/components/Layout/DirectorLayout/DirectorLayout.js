import {Container} from "react-bootstrap";

import SiteHeader from './SiteHeader';
import Navigation from './Navigation';
import Footer from './Footer';
import classes from './DirectorLayout.module.scss';

const directorLayout = ({children}) => {
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
          {children}
        </Container>
      </main>

      <Container fluid={'lg'}>
        <Footer/>
      </Container>
    </div>
  )
}

export default directorLayout;