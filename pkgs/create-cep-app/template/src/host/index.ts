/// <reference path="../node_modules/types-for-adobe/Illustrator/2015.3/index.d.ts" />

import "extendscript-es5-shim";
import "extendscript-es6-shim";
import { createMessageHandler } from "@hanakla/cep-utils";

const messageHandler = createMessageHandler()
  .event("alert", (message: string) => {
    alert(message);
  })
  .event("example", () => ({ reponse: "It's response from host!" }));

$.global.messageHandler = messageHandler.handler;

export type MessageHandler = typeof messageHandler;
