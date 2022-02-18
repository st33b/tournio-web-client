import {useRouter} from "next/router";

import {Nav, Navbar} from "react-bootstrap";

import {useAuthContext} from "../../../store/AuthContext";

import classes from './Navigation.module.scss';

const navigation = (props) => {
  // const authContext = useContext(AuthContext);
  const authContext = useAuthContext();
  const router = useRouter();
  const isLoggedIn = authContext.isLoggedIn;

  const logoutHandler = () => {
    // fire off a logout request to the server. Not here, though.

    authContext.logout();
    router.push('/login');
  }

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
            {isLoggedIn && (
              <Nav.Link href={'/director/users'}>
                User Accounts
              </Nav.Link>
            )}
            {isLoggedIn && (
              <Nav.Link href={'/director/profile'}>
                My Profile
              </Nav.Link>
            )}
          </Nav>
          <Nav className={'ms-auto pe-2'}>
            {isLoggedIn && (
              <Nav.Link onClick={logoutHandler}>
                Log Out
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default navigation;