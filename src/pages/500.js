import Image from "next/image";
import notFoundImage from '../images/oops.png'
import classes from './errorStyles.module.scss';

const error404 = () => (
    <div className={`${classes.error404} text-center`}>
      <div className={classes.message}>
        <Image src={notFoundImage}
               alt={'Overwhelmed bowling ball with pins'}
               className={classes.image}
               />
        <h3 className={`${classes.message__title} mt-3`}>Whoops!</h3>
        <p>Something went wrong somewhere.</p>
      </div>
    </div>
  );

export default error404;
