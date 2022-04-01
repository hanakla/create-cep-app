import type {} from "styled-components/cssprop";

import { useCallback } from "react";
import { postMessageToHost } from "./infra/host";
import GlobalStyle from "./styles/GlobalStyle";
import { ReloadButton } from "./components/ReloadButton";

export function App() {
  const handleClickAlertButton = useCallback(async () => {
    await postMessageToHost("alert", "Alert from host");
  }, []);

  return (
    <>
      <GlobalStyle />
      <h1
        css={`
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: bold;
        `}
      >
        THIS IS
        <br />
        <span
          css={`
            display: inline-block;
            padding: 0 4px;
            background-color: rgba(51, 51, 51, 0.5);
            border-radius: 4px;
          `}
        >
          @hanakla/create-cep-app
        </span>
        <br />
        EXAMPLE
      </h1>

      <sp-button
        size="s"
        variant="primary"
        quiet
        onClick={handleClickAlertButton}
      >
        <sp-icon-alert slot="icon" />
        Alert
      </sp-button>

      <ReloadButton />
    </>
  );
}
