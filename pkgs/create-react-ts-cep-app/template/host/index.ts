/// <reference path="../node_modules/types-for-adobe/Illustrator/2015.3/index.d.ts" />

import "extendscript-es5-shim-ts";
import "es6-string-polyfills";
import { MessageTypes } from "../shared/MessageTypes";

$.global.receiveMessage = ({ type, ...payload }: MessageTypes) => {
  switch (type) {
    case "examples": {
      return;
    }
  }
};
