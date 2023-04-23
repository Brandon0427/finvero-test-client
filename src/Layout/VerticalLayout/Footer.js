import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid ={true}>
          <Row>
            <Col sm={6}>{new Date().getFullYear()} © Optioutlet.</Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                Developed by <a href={"https://www.brandonaj.dev"}>brandonaj.dev</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>

  );
}

export default Footer;