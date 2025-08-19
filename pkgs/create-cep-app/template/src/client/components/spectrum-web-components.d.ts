import type React from "react";
import "@spectrum-web-components/bundle/elements.js";

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

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends _Components.SpectrumElementTypes {}
  }
}
