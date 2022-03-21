import Head from 'next/head';

export const siteTitle = 'IGBO Tournament Registration';

const SiteHeader = () => (
  <Head>
    <title>{siteTitle}</title>
    <meta httpEquiv={"Content-Type"} content={"text/html; charset=utf-8"} />
    <meta name={"title"} content={siteTitle} />
    <meta name={"viewport"} content={"width=device-width, initial-scale=1.0, shrink-to-fit=no"} />
    <meta name={'description'} content={'Registration portal for IGBO tournaments'} />
    <meta name={'twitter:card'} content={'summary_large_image'} />
  </Head>
);

export default SiteHeader;