import classes from './Navigation.module.scss';
import {Container, Nav, Navbar} from "react-bootstrap";

const navigation = (props) => {
  return (
    <div className={classes.Navigation}>
      <Navbar variant={'dark'} bg={'dark'}>
        <div className={classes.BrandWrapper}>
          <Navbar.Brand href={'/director'}>
            <div className={'d-none d-sm-inline'}>
              Tournament Director
            </div>
            <div className={'d-inline d-sm-none'}>
              Director
            </div>
          </Navbar.Brand>
        </div>
        <Navbar.Collapse id={'basic-navbar-nav'}>
          <Nav className={'me-auto'}>
            <Nav.Link href={'/director/users'}>
              User Accounts
            </Nav.Link>
            <Nav.Link href={'/director/profile'}>
              My Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default navigation;