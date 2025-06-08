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
      <h1 className="mb-4 text-2xl font-bold">
        THIS IS
        <br />
        <span className="inline-block px-1 bg-gray-800/50 rounded">
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
