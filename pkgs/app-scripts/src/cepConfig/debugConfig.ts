import format from "xml-formatter";
import { escaleFalsy } from "../utils/escapeFalsy";
import { HostNameMap } from "./constants";

type DebugConfig = {
  extensionId: string;
  ports: { [K in keyof typeof HostNameMap]?: number };
};

export const debugConfig = (ports: DebugConfig) => ports;

export const buildDotDebug = ({ extensionId, ports }: DebugConfig) => {
  const result = escaleFalsy`
    <?xml version="1.0" encoding="UTF-8"?>
    <ExtensionList>
        <Extension Id="${extensionId}">
            <HostList>
                ${Object.entries(
                  ([app, port]) => `
                  <!-- ${app} -->
                  <Host Name={${HostNameMap[app][0]} Port="${port}" />
                `
                ).join("")}
            </HostList>
        </Extension>
    </ExtensionList>
  `;

  return format(result);
};
