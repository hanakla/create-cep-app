import "./libs/CSInterface";
import domready from "domready";
import { render } from "react-dom";
import { App } from "./components/App";
import { reloadHostScript } from "./infra/host";

declare global {
  interface Window {
    csInterface: CSInterface;
  }
}

window.csInterface = new CSInterface();

domready(() => {
  reloadHostScript();

  render(<App />, document.getElementById("app"));
});
