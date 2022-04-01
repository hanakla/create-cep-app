export type Apps =
  | "photoshop"
  | "illustrator"
  | "indesign"
  | "incopy"
  | "premiere"
  | "aftereffects"
  | "prelude"
  | "animate"
  | "audition"
  | "dreamweaver";

export const HostNameMap: {
  [K in Apps]: string[];
} = {
  photoshop: ["PHXS", "PHSP"],
  illustrator: ["ILST"],
  indesign: ["IDSN"],
  incopy: ["AICY"],
  premiere: ["PPRO"],
  aftereffects: ["AEFT"],
  prelude: ["PRLD"],
  animate: ["FLPR"],
  audition: ["AUDT"],
  dreamweaver: ["DRWV"],
};
