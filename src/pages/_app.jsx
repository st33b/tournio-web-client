import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../styles.scss';

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page ) => page);
  return getLayout(<Component {...pageProps} />);
}
