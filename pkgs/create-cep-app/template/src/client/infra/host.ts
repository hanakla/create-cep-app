import type { MessageTypes, ResponseTypes } from "../../shared/MessageTypes";
import { CSInterface, csInterface } from "./csInterface";

/** Reloading the host script */
export async function reloadHostScript() {
  const extPath =
    csInterface.getSystemPath(CSInterface.SystemPath.EXTENSION) +
    "/dist/host/index.js";

  const result = await new Promise((r) =>
    csInterface.evalScript(`$.evalFile("${extPath}")`, r)
  );

  console.log("hostscript reloaded: ", { result });
}

export async function postMessageToHost<K extends keyof MessageTypes>(
  type: K,
  ...payload: MessageTypes[K]
): Promise<ResponseTypes[K]> {
  const result = await new Promise<string>((resolve) => {
    csInterface.evalScript(
      `messageHandler(${JSON.stringify({ type, payload })})`,
      resolve
    );
  });

  try {
    const json = JSON.parse(result);
    console.info(`📩 postMessageToHost result(${type})`, json);
    return json;
  } catch (e) {
    console.error("postMessageToHost failed", {
      type,
      payload,
      result,
      error: e,
    });
    throw new Error(`postMessageToHost(${type}) failed: ${result}`);
  }
}
