declare namespace _Components {
  type Filter<T, A> = T extends A ? T : never;

  type SpectrumElementNames = Filter<
    keyof HTMLElementTagNameMap,
    `sp-${string}`
  >;
  type SpectrumElements = {
    [K in SpectrumElementNames]: HTMLElementTagNameMap[K];
  };

  type SpectrumElementTypes = {
    [K in SpectrumElementNames]: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { children?: React.ReactNode } & Omit<
        {
          [P in keyof SpectrumElements[K]]?: SpectrumElements[K][P];
        },
        "children"
      >;
  };
}

// type _ = SpectrumElementTypes["sp-button"]["size"];
// type Button = keyof SpectrumElements["sp-button"] // ["size"];
// type _ = Button['variant']// ["size"];

declare namespace JSX {
  interface IntrinsicElements extends _Components.SpectrumElementTypes {}
}
