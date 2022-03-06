import classes from './Footer.module.scss';

const footer = () => (
  <div className={classes.Footer}>
    <p className={'text-muted text-center py-2 my-2'}>
      This website is designed to work with all modern browsers, regardless of device. &copy; 2015-2022
      {' '}
      <a href={'mailto:info@igbo-reg.com'}>
        Scott Stebleton
      </a>
    </p>
  </div>
);

export default footer;