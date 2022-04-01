import * as IlstUtils from "./illustrator";
import {
  createMessageHandler,
  MessageRequestTypesOf,
  MessageResponseTypeOf,
} from "./common/messageHandler";
import { themeClasses } from "./common/themeClasses";

// if using `export from` syntax, TSC generates ES5+ code and
// dead in ExtendScript engine
export {
  IlstUtils,
  createMessageHandler,
  MessageRequestTypesOf,
  MessageResponseTypeOf,
  themeClasses,
};
