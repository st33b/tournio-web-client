import classes from './Footer.module.scss';

const footer = () => (
  <div className={classes.Footer}>
    <p className={'text-muted text-center py-2 my-2'}>
      <a href={'/about'}>
        About this site
      </a>
      {' '}
      &copy; 2015-2022
      {' '}
      <a href={'mailto:info@igbo-reg.com'}>
        Scott Stebleton
      </a>
    </p>
  </div>
);

export default footer;