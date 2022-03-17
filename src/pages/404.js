import classes from './errorStyles.module.scss';

const error404 = () => (
    <div className={`${classes.error404} text-center`}>
      <div className={classes.message}>
        <img className={classes.image} src="/images/oops.png" alt="Overwhelmed bowling ball with pins"/>
        <h3 className={`${classes.message__title} mt-3`}>404 Not Found</h3>
        <p>I could not find the page you requested.</p>
      </div>
    </div>
  );

export default error404;