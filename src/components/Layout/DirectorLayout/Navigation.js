import {useState, useEffect} from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './Navigation.module.scss';
import {useClientReady} from "../../../utils";

const Navigation = () => {
  const directorContext = useDirectorContext();

  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    setIsSuperuser(directorContext.user && directorContext.user.role === 'superuser');
  }, [directorContext.isLoggedIn, directorContext.user]);

  const ready = useClientReady();
  if (!ready) {
    return '';
  }

  let content = '';
  if (directorContext.user) {
    content = (
      <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id={'basic-navbar-nav'}>
          <Nav className={'ms-4 me-auto'}>
            {isSuperuser && (
              <Nav.Link href={'/director/users'}>
                User Accounts
              </Nav.Link>
            )}
            {(isSuperuser || directorContext.user.tournaments.length > 1) && (
              <Nav.Link href={'/director/tournaments'}>
                Tournaments
              </Nav.Link>
            )}
            <Nav.Link href={'/director/users/' + directorContext.user.identifier}>
              My Profile
            </Nav.Link>
          </Nav>
          <Nav className={'ms-2 ms-md-auto pe-2'}>
            <Nav.Link href={'/director/logout'}>
              Log Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </>
    );
  }

  return (
    <div className={classes.Navigation}>
      <Navbar variant={'dark'} bg={'dark'} collapseOnSelect expand={'md'}>
        <div className={classes.BrandWrapper}>
          <Navbar.Brand href={'/'} className={classes.Brand}>
            {/* This is a bit of a hack to make the image clickable. It will resize to however long the text is. */}
            <span className={'invisible'}>
              Tournio-oh-oh
            </span>
            {/* For assistive technologies */}
            <span className={`visually-hidden`}>
              Tournio
            </span>
          </Navbar.Brand>
        </div>
        {content}
      </Navbar>
    </div>
  );
};

export default Navigation;