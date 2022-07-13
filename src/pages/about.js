import FrontLayout from '../components/Layout/FrontLayout/FrontLayout';
import About from "../components/About/About";
import {Card, Col, Row} from "react-bootstrap";

const Page = () => (
  <div>
    <About />
    <Row className={'justify-content-center pt-3'}>
      <Col xs={12} sm={4} >
        <Card>
          <Card.Body>
            <Card.Text className={'text-center'}>
              <Card.Link href={'/'}>
                Tournio Home
              </Card.Link>
              <Card.Link href={'/tournaments'}>
                Active Tournaments
              </Card.Link>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
)

Page.getLayout = function getLayout(page) {
  return (
    <FrontLayout showHomeLink={true}>
      {page}
    </FrontLayout>
  );
}

export default Page;