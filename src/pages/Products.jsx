import ListProducts from "../components/ListProducts";
import React, { useEffect } from "react";
import TopBar from "../components/TopBar";

export default function Product({appConfig, setAppConfig}) {
  const config = appConfig;

  useEffect(() => {
    document.title = `${
      "Mox Price List" +
      " - " +
      config.pricing.toUpperCase() +
      " - " +
      config.currency.toUpperCase() +
      " - " +
      config.lang.toUpperCase()+
      " - " +
      config.lengthType.toUpperCase()
    }`;
  });
  return (
    <>
      <TopBar appConfig={appConfig} setAppConfig={setAppConfig} />
      <ListProducts appConfig={appConfig} />
    </>
  );
}
