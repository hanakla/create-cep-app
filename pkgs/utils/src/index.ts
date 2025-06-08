/** Utility functions for Illustrator */
import * as ilstUtils from "./illustrator";
import {
  createMessageHandler,
  MessageRequestTypesOf,
  MessageResponseTypeOf,
} from "./common/messageHandler";
import { themeClasses } from "./common/themeClasses";

// if using `export from` syntax, TSC generates ES5+ code and
// dead in ExtendScript engine
export {
  ilstUtils,
  createMessageHandler,
  MessageRequestTypesOf,
  MessageResponseTypeOf,
  themeClasses,
};
