import CalcForm from "../components/CalcForm";
// import SurfaceForm from "../components/SurfaceForm";
import React, { useEffect } from "react";
import TopBar from "../components/TopBar";

export default function Dashboard({appConfig, setAppConfig}) {
  useEffect(() => {
    document.title = "Dashboard";
  });
  return (
    <>
      <TopBar appConfig={appConfig} setAppConfig={setAppConfig} />
      <CalcForm appConfig={appConfig} setAppConfig={setAppConfig} />
      {/*<SurfaceForm appConfig={appConfig} setAppConfig={setAppConfig} />*/}
    </>
  );
}
