import {useRouter} from "next/router";

import classes from './Footer.module.scss';

const Footer = () => {
  const router = useRouter();

  return (
    <div className={classes.Footer}>
      <p className={'text-muted text-center py-2 my-2'}>
        {router.pathname !== '/about' &&
          <a href={'/about'} className={`${classes.Element} ${classes.About}`}>
            About
          </a>
        }
        <span className={classes.Element}>
          &copy; 2015-2022{' '}
          <a href={'mailto:info@tourn.io'}>
            Scott Stebleton
          </a>
        </span>
      </p>
    </div>
  );
}

export default Footer;