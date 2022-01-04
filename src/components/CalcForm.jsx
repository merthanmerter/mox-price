import React, {useState} from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import config from "../config.json";

export default function CalcForm({appConfig}) {

  const [lme, setLme] = useState(appConfig.lme);
  const [premium, setPremium] = useState(appConfig.premium);
  const [conversion, setConversion] = useState(appConfig.conversion);
  const [usdtl, setUsd] = useState(appConfig.usdtl);
  const [eurusd, setEur] = useState(appConfig.eurusd);
  const [gbpusd, setGbp] = useState(appConfig.gbpusd);

  const changeInput = (type, event) => {
    var value = parseFloat(event.target.value);
    switch (type) {
      case 'lme':
        setLme(value);
      break;
      case 'premium':
        setPremium(value);
      break;
      case 'conversion':
        setConversion(value);
      break;
      case 'usdtl':
        setUsd(value);
      break;
      case 'eurusd':
        setEur(value);
      break;
      case 'gbpusd':
        setGbp(value);
      break;
    }
  }

  const submitForm = (event) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({lme, premium, conversion, usdtl, eurusd, gbpusd})
    };
    console.log('requestOptions', requestOptions);
    fetch("https://moxsystems.com/data/calc/?cnf=write", requestOptions)
      .then(response => response.json())
      .then(data => {
        alert(data.result);
      });

    event.preventDefault();
  };

  return (
    <Container className="mt-4 printhide">
      <Form onSubmit={submitForm}>
        <Row>
          <Col>
            <Form.Label>LME</Form.Label>
            <Form.Control defaultValue={lme} onChange={(event) => {changeInput('lme', event);}} />
          </Col>
          <Col>
            <Form.Label>Premium</Form.Label>
            <Form.Control defaultValue={appConfig.premium} onChange={(event) => {changeInput('premium', event);}} />
          </Col>
          <Col>
            <Form.Label>Conversion</Form.Label>
            <Form.Control defaultValue={appConfig.conversion} onChange={(event) => {changeInput('conversion', event);}} />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Form.Label>USD/TL</Form.Label>
            <Form.Control defaultValue={appConfig.usdtl} onChange={(event) => {changeInput('usdtl', event);}} />
          </Col>
          <Col>
            <Form.Label>EUR/USD</Form.Label>
            <Form.Control defaultValue={appConfig.eurusd} onChange={(event) => {changeInput('eurusd', event);}} />
          </Col>
          <Col>
            <Form.Label>GBP/USD</Form.Label>
            <Form.Control defaultValue={appConfig.gbpusd} onChange={(event) => {changeInput('gbpusd', event);}} />
          </Col>
        </Row>
        <Row className="mt-4" align="right">
          <Col>
            <Button type={"submit"} variant="dark" onClick={submitForm}>Update</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
