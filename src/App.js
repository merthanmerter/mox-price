import React, {useEffect, useState} from 'react';
import "./assets/css/main.css";
import Product from "./pages/Products";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import initConfig from "./config.json";

function App() {

  var selectedPricing = '';
  var selectedLanguage = '';
  var selectedCurrency = '';
  var selectedLengthType = '';
  var selectedLengthTitle = '';

  var hash = window.location.hash;

  if (hash !== '') {
    if (hash === '#wholesale') {
      selectedPricing = 'wholesale';
    } else if (hash === '#retail') {
      selectedPricing = 'retail';
    } else if (hash === '#tr') {
      selectedLanguage = 'tr';
    } else if (hash === '#en') {
      selectedLanguage = 'en';
    } else if (hash === '#usd') {
      selectedCurrency = 'usd';
    } else if (hash === '#eur') {
      selectedCurrency = 'eur';
    } else if (hash === '#gbp') {
      selectedCurrency = 'gbp';
    } else if (hash === '#imperial') {
      selectedLengthType = 'imp';
      selectedLengthTitle = 'inch';
    } else if (hash === '#metric') {
      selectedLengthType = 'metric';
      selectedLengthTitle = 'mm';
    }
  }

  var startConfig = initConfig;
  startConfig['lengthType'] = selectedLengthType;
  startConfig['lengthTitle'] = selectedLengthTitle;
  startConfig['lang'] = selectedLanguage;
  startConfig['currency'] = selectedCurrency;
  startConfig['pricing'] = selectedPricing;

  const [appConfig, setAppConfig] = useState(startConfig);
  const [loading, setLoading] = useState(true);
  const [cnfRetrieved, setCnfRetrieved] = useState(false);

  useEffect(() => {
    if (!cnfRetrieved) {
      fetch("https://moxsystems.com/data/calc/?cnf=read")
        .then(res => res.json())
        .then(
          (result) => {
            var sConfig = result['cnf'];
            if (selectedLengthType !== '') {
              sConfig['lengthType'] = selectedLengthType;
            }
            if (selectedLengthTitle !== '') {
              sConfig['lengthTitle'] = selectedLengthTitle;
            }
            if (selectedLanguage !== '') {
              sConfig['lang'] = selectedLanguage;
            }
            if (selectedCurrency !== '') {
              sConfig['currency'] = selectedCurrency;
            }
            if (selectedPricing !== '') {
              sConfig['pricing'] = selectedPricing;
            }
            setAppConfig(sConfig);
            setCnfRetrieved(true);
            setLoading(false);
          },
          (error) => {
            alert(error);
          }
        );
    }
  })

  if (loading) {
    return <div>loading</div>;
  }
  return <BrowserRouter>
    <>
      <Switch>
        {/*<Route path="/" component={Product} exact />*/}
        {/*<Route path="/dashboard" component={Dashboard} />*/}
        <Route path="/" exact render={(props) => (
          <Product {...props} appConfig={appConfig} setAppConfig={setAppConfig} />
        )} />
        <Route path="/dashboard" exact render={(props) => (
          <Dashboard {...props} appConfig={appConfig} setAppConfig={setAppConfig} />
        )} />
      </Switch>
    </>
  </BrowserRouter>
}

export default App;
