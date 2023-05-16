import {useState, useEffect} from 'react';
import {Nav, Navbar} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './Navigation.module.scss';
import {useClientReady} from "../../../utils";
import ColorModeToggler from "../../common/ColorModeToggler/ColorModeToggler";

const markup = (content = '') => {
  return (
    <div className={classes.Navigation}>
      <Navbar collapseOnSelect expand={'md'} className={`${classes.DirectorLinks}`}>
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
}

const Navigation = () => {
  const {directorState} = useDirectorContext();

  const ready = useClientReady();
  if (!ready) {
    return markup();
  }

  if (!directorState.user) {
    return markup();
  }

  const links = [];

  links.push({
    href: '/director/tournaments',
    text: 'Tournaments',
  });

  if (directorState.user.role === 'superuser') {
    links.push({
      href: '/director/users',
      text: 'User Accounts',
    });
  }

  const navContent = (
    <>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id={'basic-navbar-nav'}>
        <Nav className={'ms-4 me-auto'}>
          {links.map((l, i) => (
            <Nav.Link key={i} href={l.href}>
              {l.text}
            </Nav.Link>
          ))}
          <Nav.Link href={'/director/users/' + directorState.user.identifier}>
            My Profile
          </Nav.Link>
        </Nav>
        <Nav className={'ms-2 ms-md-auto pe-2'}>
          <Nav.Link href={'/director/logout'}>
            Log Out
          </Nav.Link>
        </Nav>
        <Nav className={'d-none d-md-block'}>
          <ColorModeToggler className={''} />
          {/*<ColorModeToggler className={'ms-auto d-none d-md-inline-block'} />*/}
        </Nav>
      </Navbar.Collapse>
    </>
  );

  return markup(navContent);
};

export default Navigation;
