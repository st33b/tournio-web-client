import {useState, useEffect} from 'react';
import {Nav, Navbar} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './Navigation.module.scss';

const Navigation = () => {
  const directorContext = useDirectorContext();

  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    setLoggedIn(directorContext.isLoggedIn);
    setIsSuperuser(directorContext.user && directorContext.user.role === 'superuser');
  }, [directorContext.isLoggedIn, directorContext.user]);

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
              <Nav.Link href={'/director/logout'}>
                Log Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Navbar>
    </div>
  );
};

export default Navigation;