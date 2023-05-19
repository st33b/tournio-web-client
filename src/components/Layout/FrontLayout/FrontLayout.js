import {Container} from "react-bootstrap";

import {ThemeContextProvider} from "../../../store/ThemeContext";
import SiteHeader from './SiteHeader';
import Footer from './Footer';

import classes from './FrontLayout.module.scss';

const FrontLayout = ({children}) => {
  return (
    <ThemeContextProvider>
      <div className={classes.FrontLayout}>
        <SiteHeader/>
        <main>
          <Container fluid={'md'}>
            {children}
          </Container>
        </main>
        <footer>
          <Container fluid={'md'}>
            <Footer/>
          </Container>
        </footer>
      </div>
    </ThemeContextProvider>
  );
}

export default FrontLayout;
