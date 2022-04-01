export const escaleFalsy = ({ raw }: TemplateStringsArray, ...subs: any[]) => {
  // const result: string[] = []
  return raw
    .reduce((prev, cur, idx) => {
      prev.push(cur, subs.shift());
      return prev;
    }, [] as string[])
    .join("");
};
