/// <reference path="./components/spectrum-web-components.d.ts" />
import type { RGBColor } from "@extendscript/csinterface";

import "@spectrum-web-components/bundle/elements";
import "@spectrum-web-components/icons/sp-icons-medium";
import "@spectrum-web-components/icons/sp-icons-large";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-bell";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-refresh";

import domready from "domready";
import { ReactNode, useEffect, useState } from "react";
import { render } from "react-dom";
import { TinyColor } from "@ctrl/tinycolor";
import { App } from "./App";
import { csInterface, CSInterface } from "./infra/csInterface";
import { reloadHostScript } from "./infra/host";
import { themeManager } from "./libs/themeManager";

domready(async () => {
  themeManager.init();
  reloadHostScript();

  render(
    <ThemeListener>
      <App />
    </ThemeListener>,
    document.getElementById("app")
  );
});

//
// theming
//
const getCurrentAppTheme = () => {
  const color = csInterface.getHostEnvironment().appSkinInfo
    .panelBackgroundColor.color as RGBColor;

  const tc = new TinyColor({ r: color.red, g: color.green, b: color.blue });
  return tc.getBrightness() < 128 ? ("dark" as const) : ("light" as const);
};

const ThemeListener = ({ children }: { children: ReactNode }) => {
  const [theme, setAppTheme] = useState(getCurrentAppTheme());

  useEffect(() => {
    const onThemeChange = () => setAppTheme(getCurrentAppTheme());

    csInterface.addEventListener(
      CSInterface.THEME_COLOR_CHANGED_EVENT,
      onThemeChange
    );

    return () =>
      csInterface.removeEventListener(
        CSInterface.THEME_COLOR_CHANGED_EVENT,
        onThemeChange
      );
  });

  return (
    <sp-theme scale="medium" color={theme}>
      {children}
    </sp-theme>
  );
};
