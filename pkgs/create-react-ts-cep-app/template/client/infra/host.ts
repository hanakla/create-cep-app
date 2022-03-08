import { MessageTypes } from "../../shared/MessageTypes";

export async function reloadHostScript() {
  const extPath =
    window.csInterface.getSystemPath(SystemPath.EXTENSION) +
    "/dist/host/hostscript.js";

  const result = await new Promise((r) =>
    window.csInterface.evalScript(`$.evalFile("${extPath}")`, r)
  );

  console.log("hostscript reloaded: ", result);
}

export async function postMessageToHost(msg: MessageTypes) {
  const result = await new Promise<string>((resolve) => {
    window.csInterface.evalScript(
      `receiveMessage(${JSON.stringify(msg)})`,
      resolve
    );
  });

  try {
    return JSON.parse(result);
  } catch (e) {
    throw new Error(`postMessage(${msg.type}) failed: ${result}`);
  }
}
