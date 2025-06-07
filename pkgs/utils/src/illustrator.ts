/// <reference path="./types.d.ts" />

export const queryPageItem = (
  doc: Document,
  query?: { hidden?: boolean; locked?: boolean } & (
    | {
        name: string | RegExp | ((item: PageItem) => boolean);
      }
    | { uuid: number }
    | { typename: string }
  )
): PageItem[] => {
  let { items } = getAllPageItems(doc);

  if (!query) return items;

  if ("name" in query) {
    items = items.filter((item) => {
      if (query.name instanceof RegExp) return query.name.test(item.name);
      else if (typeof query.name === "function") return query.name(item);
      else return item.name === query.name;
    });
  }

  if ("uuid" in query) {
    items = items.filter((item) => (item as any).uuid === query.uuid);
  }

  if ("typename" in query) {
    items = items.filter((item) => item.typename === query.typename);
  }

  if (query.hidden !== void 0) {
    items = items.filter((item) => item.hidden === query.hidden);
  }

  if (query.locked !== void 0) {
    items = items.filter((item) => item.locked === query.locked);
  }

  return items;
};

/** @see https://zephmann.wordpress.com/2019/04/05/recursive-template-function-for-adobe-illustrator/ */
const getAllPageItems = (
  parent: Document | Layer | PageItem | GroupItem | PathItem,
  allItems = { items: [] as PageItem[], notice: [] }
) => {
  if ("layers" in parent) {
    for (const layer of parent.layers) {
      getAllPageItems(layer, allItems);
    }
  }

  if ("pageItems" in parent) {
    for (const item of parent.pageItems) {
      getAllPageItems(item, allItems);
    }
  }

  if ("uuid" in parent) {
    if (allItems.items.indexOf(parent as any) < 0) {
      allItems.items.push(parent as any);
    }
  }

  return allItems;
};
