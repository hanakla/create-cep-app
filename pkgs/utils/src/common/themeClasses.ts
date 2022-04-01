function keyMirror<T extends object>(t: T): { [K in keyof T]: K } {
  return Object.keys(t).reduce(
    (a, k) => Object.assign(a, { [k]: k }),
    Object.create(null)
  );
}

export const themeClasses = keyMirror({
  hostElt: null,
  hostBgd: null,
  hostBgdDark: null,
  hostBgdLight: null,
  hostFontSize: null,
  hostFontFamily: null,
  hostFont: null,
  hostButton: null,
});
