import format from "xml-formatter";
import { escaleFalsy } from "../utils/escapeFalsy";
import { Apps, HostNameMap } from "./constants";

export type CEPManifest = {
  bundleId: string;
  locales: Array<string> | "All";
  requiredRuntime: {
    CSXS: "5.0" | "6.0" | "7.0" | "8.0" | "9.0" | "10.0" | "11.0";
  };
  hostApps: {
    [K in Apps]?: { version: `[${string},${string}]` };
    // photoshop?: { version: `[${string},${string}]` };
    // illustrator?: { version: `[${string},${string}]` };
    // indesign?: { version: `[${string},${string}]` };
    // incopy?: { version: `[${string},${string}]` };
    // premiere?: { version: `[${string},${string}]` };
    // aftereffects?: { version: `[${string},${string}]` };
    // prelude?: { version: `[${string},${string}]` };
    // animate?: { version: `[${string},${string}]` };
    // audition?: { version: `[${string},${string}]` };
    // dreamweaver?: { version: `[${string},${string}]` };
  };
  extensions: Array<{
    id: string;
    version: string;
    mainPath: string;
    cefCommandLine?: Array<
      | "--enable-media-stream"
      | "--enable-speech-input"
      | "--persist-session-cookies"
      | "--disable-image-loading"
      | "--disable-javascript-open-windows"
      | "--disable-javascript-close-windows"
      | "--disable-javascript-access-clipboard"
      | "--enable-caret-browsing"
      | "--proxy-auto-detect"
      | "--user-agent"
      | "--disable-application-cache"
      | "--enable-nodejs"
      | "--disable-pinch"
      | "--mixed-context"
    >;
    scriptPath?: string;
    lifeCycle: {
      autoVisible: boolean;
      startOn?: {
        events: string[];
      };
    };
    ui: {
      type: "Panel" | "ModalDialog" | "Modeless" | "Custom";
      menu: string;
      geometry: {
        size: { width: number; height: number };
        minSize?: { width: number; height: number };
        maxSize?: { width: number; height: number };
      };
    };
    icons?: {
      Normal?: string;
      RollOver?: string;
      Disabled?: string;
      DarkNormal?: string;
      DarkRollOver?: string;
    };
  }>;
};

export function defineCEPManifest(option: CEPManifest) {
  return option;
}

export function buildManifest(option: CEPManifest) {
  const manifest = escaleFalsy`
    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <ExtensionManifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ExtensionBundleId="${
      option.bundleId
    }" ExtensionBundleVersion="1.0" Version="6.0">
      <ExtensionList>
        ${option.extensions.map(
          (ex) => `<Extension Id="${ex.id}" Version="${ex.version}" />`
        )}
      </ExtensionList>
      <ExecutionEnvironment>
        <HostList>
          ${Object.entries(option.hostApps)
            .map(([name, opt]) =>
              HostNameMap[name as keyof typeof HostNameMap]
                .map(
                  (ident) => `<Host Name="${ident}" Version="${opt.version}" />`
                )
                .join("\n")
            )
            .join("\n")}
        </HostList>
        <LocaleList>
          ${
            option.locales === "All"
              ? `<Locale Code="All" />`
              : option.locales.map((l) => `<Locale Code="${l}" />`)
          }
        </LocaleList>
        <RequiredRuntimeList>
          <RequiredRuntime Name="CSXS" Version="${
            option.requiredRuntime.CSXS
          }" />
        </RequiredRuntimeList>
      </ExecutionEnvironment>
      <DispatchInfoList>
        ${option.extensions.map(
          (ext) =>
            escaleFalsy`
              <Extension Id="${ext.id}">
                <DispatchInfo>
                  <Resources>
                    <MainPath>${ext.mainPath}</MainPath>
                    ${
                      ext.scriptPath &&
                      `<ScriptPath>${ext.scriptPath}</ScriptPath>`
                    }
                    ${
                      ext.cefCommandLine != null &&
                      `
                        <CEFCommandLine>
                          ${ext.cefCommandLine
                            .map((param) => `<Parameter>${param}</Parameter>`)
                            .join("")}
                        </CEFCommandLine>
                      `
                    }
                  </Resources>
                  <Lifecycle>
                    <AutoVisible>${
                      ext.lifeCycle.autoVisible ? "true" : "false"
                    }</AutoVisible>
                    ${
                      ext.lifeCycle.startOn &&
                      `
                        <StartOn>
                          ${ext.lifeCycle.startOn?.events.map(
                            (ev) => `<Event>${ev}</Event>`
                          )}
                        </StartOn>
                      `
                    }
                  </Lifecycle>
                  <UI>
                    <Type>${ext.ui.type}</Type>
                    <Menu>${ext.ui.menu}</Menu>
                    <Geometry>
                      <Size>
                        <Width>${ext.ui.geometry.size.width}</Width>
                        <Height>${ext.ui.geometry.size.height}</Height>
                      </Size>
                      ${
                        ext.ui.geometry.maxSize &&
                        `
                        <MaxSize>
                          <Width>${ext.ui.geometry.maxSize.width}</Width>
                          <Height>${ext.ui.geometry.maxSize.height}</Height>
                        </MaxSize>
                      `
                      }
                      ${
                        ext.ui.geometry.minSize &&
                        `
                        <MinSize>
                          <Width>${ext.ui.geometry.minSize.width}</Width>
                          <Height>${ext.ui.geometry.minSize.height}</Height>
                        </MinSize>
                      `
                      }
                    </Geometry>
                    ${
                      ext.icons &&
                      `
                      <Icons>
                        ${Object.entries(ext.icons).map(
                          ([type, value]) =>
                            `<Icon Type="${type}">${value}</Icon>`
                        )}
                      </Icons>
                    `
                    }
                  </UI>
                </DispatchInfo>
              </Extinsion>
            `
        )}
      </DispatchInfoList>
    </ExtensionManifest>
  `;

  return format(manifest, { indentation: "  ", collapseContent: true });
}
