import {useRouter} from "next/router";

import classes from './Footer.module.scss';

const Footer = () => {
  const router = useRouter();

  return (
    <div className={classes.Footer}>
      <p className={'text-muted text-center py-2 my-2'}>
        <a href={'/director/login'} className={`${classes.Element} ${classes.NotTheLast}`}>
          Director Login
        </a>
        {router.pathname !== '/about' &&
          <a href={'/about'} className={`${classes.Element} ${classes.NotTheLast}`}>
            About
          </a>
        }
        <span className={classes.Element}>
          &copy; 2015-2022{' '}
          <a href={'mailto:info@tourn.io'}>
            Tournio
          </a>
        </span>
      </p>
    </div>
  );
}

export default Footer;