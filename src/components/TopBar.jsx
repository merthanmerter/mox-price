import React from "react";
import ReactToPrint from "react-to-print";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Button,
  Col,
} from "react-bootstrap";

export default function TopBar({appConfig, setAppConfig}) {
  const changeCurrency = (currency) => {
    var tempConfig = appConfig;
    tempConfig['currency'] = currency;
    setAppConfig(tempConfig);
  };

  const changeLanguage = (language) => {
    var tempConfig = appConfig;
    tempConfig['lang'] = language;
    setAppConfig(tempConfig);
  };

  const changePricing = (type) => {
    var tempConfig = appConfig;
    tempConfig['pricing'] = type;
    setAppConfig(tempConfig);
  };

  const changeRegion = (type) => {
    var tempConfig = appConfig;
    tempConfig['lengthType'] = type;
    tempConfig['lengthTitle'] = type === 'metric' ? 'mm' : 'inch';
    setAppConfig(tempConfig);
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      sticky="top"
      className="printhide"
    >
      <Container>
        <Navbar.Brand href="/">
          {appConfig.lang === "tr" ? "Mox Fiyat Listesi" : "Mox Price List"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className={appConfig.pricing === 'wholesale' ? 'active' : ''} href="/#wholesale" onSelect={() => {changePricing('wholesale')}}>
              {appConfig.lang === "tr" ? "Toptan Fiyatlar" : "Wholesale Prices"}
            </Nav.Link>
            <Nav.Link className={appConfig.pricing === 'retail' ? 'active' : ''} href="/#retail" onSelect={() => {changePricing('retail')}}>
              {appConfig.lang === "tr" ? "Perakende Fiyatlar" : "Retail Prices"}
            </Nav.Link>
            <NavDropdown
              title={appConfig.lang === "tr" ? "Ölçüm Sistemi" : "Measurement System"}
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item className={appConfig.lengthType === 'imp' ? 'active' : ''} href="/#imperial" onClick={(props) => {changeRegion('imp')}}>Imperial</NavDropdown.Item>
              <NavDropdown.Item className={appConfig.lengthType === 'metric' ? 'active' : ''} href="/#metric" onClick={(props) => {changeRegion('metric')}}>Metric</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={appConfig.lang === "tr" ? "Para Birimi" : "Currency"}
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item className={appConfig.currency === 'usd' ? 'active' : ''} href="/#usd" onClick={(props) => {changeCurrency('usd')}}>USD</NavDropdown.Item>
              <NavDropdown.Item className={appConfig.currency === 'eur' ? 'active' : ''} href="/#eur" onClick={(props) => {changeCurrency('eur')}}>EUR</NavDropdown.Item>
              <NavDropdown.Item className={appConfig.currency === 'gbp' ? 'active' : ''} href="/#gbp" onClick={(props) => {changeCurrency('gbp')}}>GBP</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={appConfig.lang === "tr" ? "Dil" : "Language"}
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item className={appConfig.lang === 'en' ? 'active' : ''} href="/#en" onClick={(props) => {changeLanguage('en')}}>English</NavDropdown.Item>
              <NavDropdown.Item className={appConfig.lang === 'tr' ? 'active' : ''} href="/#tr" onClick={(props) => {changeLanguage('tr')}}>Türkçe</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Col className="mx-2">
              <Button size="sm" variant="light" href="/dashboard">
                Dashboard
              </Button>
            </Col>
            <Col>
              <ReactToPrint
                trigger={() => (
                  <Button size="sm" variant="light">
                    Print
                  </Button>
                )}
                content={() => window.print()}
              />
            </Col>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
