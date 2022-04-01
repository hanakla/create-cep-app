import { MessageHandler } from "../host";
import {
  MessageRequestTypesOf,
  MessageResponseTypeOf,
} from "@hanakla/cep-utils";

export type MessageTypes = MessageRequestTypesOf<MessageHandler>;
export type ResponseTypes = MessageResponseTypeOf<MessageHandler>;
