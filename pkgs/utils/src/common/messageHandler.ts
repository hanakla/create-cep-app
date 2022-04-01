export const createMessageHandler = () => {
  return new MessageHandler();
};

class MessageHandler<
  T extends { [event: string]: { payload: any; response: any } } = {}
> {
  private handlers: any = {};

  public event<E extends string, P extends Array<any>, R>(
    event: E,
    handler: (...args: P) => R
  ): MessageHandler<
    T & { [k in E]: { payload: Parameters<typeof handler>; response: R } }
  > {
    this.handlers[event] = handler;
    return this as any;
  }

  public handler = <E extends keyof T>({
    type,
    payload,
  }: {
    type: E;
    payload: T[E]["payload"];
  }): string => {
    return JSON.stringify(this.handlers[type](...payload) ?? null);
  };
}

export type MessageRequestTypesOf<T extends MessageHandler<any>> =
  T extends MessageHandler<infer T>
    ? { [K in keyof T]: T[K]["payload"] }
    : never;

export type MessageResponseTypeOf<T extends MessageHandler<any>> =
  T extends MessageHandler<infer T>
    ? { [K in keyof T]: T[K]["response"] }
    : never;
