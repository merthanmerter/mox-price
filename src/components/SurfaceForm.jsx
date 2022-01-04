import React, { Component } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import SurfaceData from "../data/tableSurfaces.json";

export default class SurfaceForm extends Component {
  render() {
    var arr = [];
    Object.keys(SurfaceData).forEach(function (key) {
      arr.push(SurfaceData[key]);
    });

    return (
      <Container className="mt-4 printhide">
        <Form>
          <Form.Group as={Row} className="mb-3">
            {/* begin loop */}
            {arr.map((item) =>
              item.usdm2 !== undefined ? (
                <SurfaceFormChild
                  key={item.name}
                  name={item.name}
                  price={item.usdm2}
                />
              ) : null
            )}
          </Form.Group>
          <Row className="mt-4" align="right">
            <Col>
              <Button variant="dark">Update</Button>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

class SurfaceFormChild extends React.Component {
  render() {
    return (
      <>
        <Form.Label column sm={1} className="mb-3">
          {this.props.name}
        </Form.Label>
        <Col sm={3} className="mb-3">
          <Form.Control defaultValue={this.props.price} />
        </Col>
      </>
    );
  }
}
