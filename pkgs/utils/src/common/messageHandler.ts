/**
 * Create ExtendScript env message handler.
 * This handler receives messages from CEP(frontend) environment
 * that use with `postMessageToHost()` function.
 *
 * @example
 * ```ts
 * const handler = createMessageHandler()
 *   .event("test", (a: number, b: string) => {
 *     return `Received: ${a}, ${b}`;
 *   })
 *
 * // Register handler to global object
 * $.global.messageHandler = messageHandler.handler;
 *
 * // In CEP environment, you can send message like this:
 * postMessageToHost("test", [42, "Hello"]);
 * ```
 */
export const createMessageHandler = () => {
  return new MessageHandler();
};

class MessageHandler<
  T extends { [event: string]: { payload: any; response: any } } = {}
> {
  private handlers: any = {};

  /**
   * Register a message handler
   * @param event - Event name you define
   * @param handler - Handler function that receives payload and returns response
   */
  public event<E extends string, P extends Array<any>, R>(
    event: E,
    handler: (...args: P) => R
  ): MessageHandler<
    T & { [k in E]: { payload: Parameters<typeof handler>; response: R } }
  > {
    this.handlers[event] = handler;
    return this as any;
  }

  /** Execute specified handler */
  public handler = <E extends keyof T>({
    type,
    payload,
  }: {
    type: E;
    payload: T[E]["payload"];
  }): string => {
    return JSON.stringify(this.handlers[type].apply(null, payload) ?? null);
  };
}

/**
 * Get name and payload types of registered message by handler
 *
 * @example
 * ```ts
 * const handler = createMessageHandler()
 *   .event("test", (a: number, b: string) => {
 *     return `Received: ${a}, ${b}`;
 *   })
 *   .event("test2", (a: number) => {
 *     return `Received: ${a}`;
 *   });
 *
 * type RequestTypes = MessageRequestTypesOf<typeof handler>;
 * // RequestTypes will be:
 * // {
 * //   test: [number, string];
 * //   test2: [number];
 * // }
 * ```
 */
export type MessageRequestTypesOf<T extends MessageHandler<any>> =
  T extends MessageHandler<infer T>
    ? { [K in keyof T]: T[K]["payload"] }
    : never;

/**
 * Get response types of registered message by handler
 *
 * @example
 * ```ts
 * const handler = createMessageHandler()
 *   .event("test", (a: number, b: string) => {
 *     return `Received: ${a}, ${b}`;
 *   })
 *
 * type ResponseTypes = MessageResponseTypeOf<typeof handler>;
 * // ResponseTypes will be:
 * // {
 * //   test: string;
 * // }
 * ```
 */
export type MessageResponseTypeOf<T extends MessageHandler<any>> =
  T extends MessageHandler<infer T>
    ? { [K in keyof T]: T[K]["response"] }
    : never;
