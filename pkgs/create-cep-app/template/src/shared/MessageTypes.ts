import type {
  MessageRequestTypesOf,
  MessageResponseTypeOf,
} from "@hanakla/cep-utils";
import type { MessageHandler } from "../host";

export type MessageTypes = MessageRequestTypesOf<MessageHandler>;
export type ResponseTypes = MessageResponseTypeOf<MessageHandler>;
