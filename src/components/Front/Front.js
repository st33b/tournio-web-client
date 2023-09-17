import {Card, Col, Row} from "react-bootstrap";
import Image from "next/image";

import {useThemeContext} from "../../store/ThemeContext";
import {useClientReady} from "../../utils";

import logoImage from "../../images/tournio-logo.png";
import logoImageDark from "../../images/tournio-logo-inverted-gray.png";
import screenshotLight from "../../images/demo-screenshot-light.jpg";
import screenshotDark from "../../images/demo-screenshot-dark.jpg";

import classes from './Front.module.scss';

const Front = () => {
  const {theme} = useThemeContext();

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  return (
    <div className={classes.Front}>
      <div className="container col-xxl-10 px-4 pt-2 pb-md-3">
        <div className="row d-flex align-items-center g-2 g-md-4 g-lg-5 py-0 py-md-3">

          <div className="col-lg-6 pb-2 pb-md-0">
            <div className="mb-3 position-relative">
              {theme.active === 'light' &&
                <Image src={logoImage}
                       alt={"Tournio logo"}
                       width={800}
                       height={169}
                       sizes={'100vw'}
                       style={{
                         width: '100%',
                         height: 'auto',
                       }}
                />
              }
              {theme.active === 'dark' &&
                <Image src={logoImageDark}
                       alt={"Tournio logo"}
                       width={800}
                       height={166}
                       sizes={'100vw'}
                       style={{
                         width: '100%',
                         height: 'auto',
                       }}
                />
              }
            </div>
            <p className="lead mb-1">
              A registration system for IGBO bowling tournaments that is easy to use for both bowlers and
              committee members alike. With easy setup, testing, registration, administration, and reporting.
              Plus a reliable payments integration, courtesy of Stripe.
            </p>
          </div>

          <div className="d-none d-sm-block col-10 offset-1 col-lg-6 offset-lg-0">
            {theme.active === 'light' && <Image src={screenshotLight} className={"d-block mx-lg-auto img-fluid"} alt={"Demo Tournament sample image"} />}
            {theme.active === 'dark' && <Image src={screenshotDark} className={"d-block mx-lg-auto img-fluid"} alt={"Demo Tournament sample image"} />}
          </div>

        </div>
      </div>

      <Row className={'gx-lg-5'}>
        <Col sm={6} md={4}>
          <Card className={'mb-3'}>
            <Card.Header>
              <Card.Title className={'mb-0'}>
                Flexible Registration
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Allow your bowlers to register full or partial teams or register individually.
              </Card.Text>
              <Card.Text>
                There&apos;s even support for tournaments with non-traditional formats, as well as tournaments with multiple shifts.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={4}>
          <Card className={'mb-3'}>
            <Card.Header>
              <Card.Title className={'mb-0'}>
                Powerful Administration
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Test registration before opening, and simulate early or late registration periods.
              </Card.Text>
              <Card.Text>
                Fix bowler details, merge partial teams, and get email notifications of registrations and payments.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={4}>
          <Card className={'mb-3'}>
            <Card.Header>
              <Card.Title className={'mb-0'}>
                Offer Your Bowlers More
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Let your bowlers sign up for additional events and buy extra stuff: Division-based events, optional
                events, banquet tickets for non-bowlers, raffle ticket bundles, and more.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-grid gap-3 d-sm-flex justify-content-sm-center pt-sm-3">
        <a href={'/tournaments'}
           title={'See the list of current tournaments'}
           className="btn btn-success btn-lg px-4">
          See Current Tournaments
        </a>
        <a href="mailto:hello@tourn.io?subject=Using%20Tournio"
           className="btn btn-primary btn-lg px-4 gap-3">
          Get In Touch
        </a>
      </div>
    </div>
  );
}

export default Front;
