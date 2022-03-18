import Image from "next/image";
import notFoundImage from '../images/oops.png'
import classes from './errorStyles.module.scss';

const error404 = () => (
    <div className={`${classes.error404} text-center`}>
      <div className={classes.message}>
        <Image src={notFoundImage}
               layout={'fixed'}
               alt={'Overwhelmed bowling ball with pins'}
               className={classes.image}
               />
        <h3 className={`${classes.message__title} mt-3`}>404 Not Found</h3>
        <p>I could not find the page you requested.</p>
      </div>
    </div>
  );

export default error404;