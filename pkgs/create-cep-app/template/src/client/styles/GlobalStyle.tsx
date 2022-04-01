import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

export default createGlobalStyle`
  ${reset}

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 !important;
    overflow-x: hidden;
  }

  #app, sp-theme {
    width: 100%;
    height: 100%;
  }

  #app {
    padding: 8px;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;
