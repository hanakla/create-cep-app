import { MessageHandler } from "../host";
import {
  MessageRequestTypesOf,
  MessageResponseTypeOf,
} from "@hanakla/cep-utils";
import {} from "@hanakla/cep-utils/dist/shared";

export type MessageTypes = MessageRequestTypesOf<MessageHandler>;
export type ResponseTypes = MessageResponseTypeOf<MessageHandler>;
