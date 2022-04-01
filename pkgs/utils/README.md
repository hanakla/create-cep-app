# @hanakla/cep-utils

Utility fucntions for developing Adobe CEP extension (ExtendScript)

## API Overview

```ts
export {
  // Ilustrator helper
  IlstUtils,
  createMessageHandler,
  MessageRequestTypesOf,
  MessageResponseTypeOf,
  themeClasses,
};
```

## Common

### createMessageHandler

Helper for [`@hanakla/create-cep-app`](https://github.com/hanakla/create-cep-app).  
It make message handler with strict types for host script.

```ts
//
// in host script
//
const messageHandler = createMessageHandler()
  .event("alert", (message: string) => {
    alert(message);
  })
  .event("example", () => ({ reponse: "It's response from host!" }));

$.global.messageHandler = messageHandler.handler;

export type MessageHandler = typeof messageHandler;

//
// And call it from frontend
//
csInterface.evalScript(
  `messageHandler(${JSON.stringify({ type, payload })})`,
  callback
);

//
// Request and Response type can be infer.
//
import {
  MessageRequestTypesOf,
  MessageResponseTypeOf,
} from "@hanakla/cep-utils";

export type MessageTypes = MessageRequestTypesOf<MessageHandler>;
// 👆 { alert: [message: string], example: [] }

export type ResponseTypes = MessageResponseTypeOf<MessageHandler>;
// 👆 { alert: void, example: { response: string } }
```

### Illustrator

#### IlstUtils.queryPageItem(documnet: Document, query: Query): PageItem[]

Querying `PageItem` on `documnet` and returns matched PageItem[]
