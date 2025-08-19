/// <reference path="./components/spectrum-web-components.d.ts" />
import type { RGBColor } from "@extendscript/csinterface";

import "@spectrum-web-components/bundle/elements";
import "@spectrum-web-components/icons/sp-icons-medium";
import "@spectrum-web-components/icons/sp-icons-large";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-bell";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-refresh";

import { TinyColor } from "@ctrl/tinycolor";
import domready from "domready";
import { type ReactNode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { CSInterface, csInterface } from "./infra/csInterface";
import { reloadHostScript } from "./infra/host";
import { themeManager } from "./libs/themeManager";

import "./main.css";

domready(async () => {
  themeManager.init();

  // Reload the host script to ensure the latest changes are applied on page load
  // This is useful during development to avoid restarting the CEP panel
  reloadHostScript();

  createRoot(document.getElementById("app")!).render(
    <ThemeListener>
      <App />
    </ThemeListener>,
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
      onThemeChange,
    );

    return () =>
      csInterface.removeEventListener(
        CSInterface.THEME_COLOR_CHANGED_EVENT,
        onThemeChange,
      );
  });

  return (
    <sp-theme scale="medium" color={theme}>
      {children}
    </sp-theme>
  );
};
