import {useRouter} from "next/router";

import {Nav, Navbar} from "react-bootstrap";

import {useAuthContext} from "../../../store/AuthContext";

import classes from './Navigation.module.scss';
import axios from "axios";

const navigation = (props) => {
  const authContext = useAuthContext();
  const router = useRouter();
  const isLoggedIn = authContext.isLoggedIn;
  const isSuperuser = authContext.user && authContext.user.role === 'superuser';

  const logoutHandler = (event) => {
    event.preventDefault();

    const url = 'http://localhost:5000/logout';
    axios.delete(url)
      .then(response => {
        console.log('We have been logged out from the server.')
      })
      .catch(error => {
        console.log('uhh...');
        console.log(error);
      });

    authContext.logout();
    router.push('/director/login');
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
        {isLoggedIn && (
        <Navbar.Collapse id={'basic-navbar-nav'}>
          <Nav className={'me-auto'}>
            {isSuperuser && (
              <Nav.Link href={'/director/users'}>
                User Accounts
              </Nav.Link>
            )}
            {(
              <Nav.Link href={'/director/profile'}>
                My Profile
              </Nav.Link>
            )}
          </Nav>
          <Nav className={'ms-auto pe-2'}>
            {(
              <Nav.Link onClick={logoutHandler} href={'#'}>
                Log Out
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
        )}
      </Navbar>
    </div>
  );
};

export default navigation;