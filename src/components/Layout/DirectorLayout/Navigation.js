import {useState, useEffect} from 'react';
import {useRouter} from "next/router";

import {Nav, Navbar} from "react-bootstrap";

import {directorApiLogoutRequest} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './Navigation.module.scss';

const navigation = () => {
  const directorContext = useDirectorContext();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    setLoggedIn(directorContext.isLoggedIn);
    setIsSuperuser(directorContext.user && directorContext.user.role === 'superuser');
  }, [directorContext.isLoggedIn, directorContext.user]);

  const onLogoutSuccess = () => {
    router.push('/director/login');
  }

  const logoutHandler = (event) => {
    event.preventDefault();
    directorApiLogoutRequest({
      context: directorContext,
      onSuccess: onLogoutSuccess,
      onFailure: (_) => {},
    })
  }

  return (
    <div className={classes.Navigation}>
      <Navbar variant={'dark'} bg={'dark'}>
        <div className={classes.BrandWrapper}>
          <Navbar.Brand href={'/director'} className={classes.Brand}>
            <div className={'d-none d-sm-inline'}>
              Tournament Director
            </div>
            <div className={'d-inline d-sm-none'}>
              Director
            </div>
          </Navbar.Brand>
        </div>
        {loggedIn && (
          <Navbar.Collapse id={'basic-navbar-nav'}>
            <Nav className={'me-auto'}>
              {isSuperuser && (
                <Nav.Link href={'/director/users'}>
                  User Accounts
                </Nav.Link>
              )}
              {directorContext.user && (
                <Nav.Link href={'/director/users/' + directorContext.user.identifier}>
                  My Profile
                </Nav.Link>
              )}
            </Nav>
            <Nav className={'ms-auto pe-2'}>
              <Nav.Link onClick={logoutHandler} href={'#'}>
                Log Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Navbar>
    </div>
  );
};

export default navigation;