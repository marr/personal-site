import { expect, describe, it } from 'vitest';

const getPages = (length = 5) => (max, start) => {
  const numArrays = Math.ceil(((max - start) + 1) / length);
  return Array.from(({ length: numArrays }), (_, i) => {
      const startOfRow = (i * length) + start;
      const arrLength = Math.min((max - startOfRow) + 1, length);
      return Array.from(({ length: arrLength }), (_, j) => {
          return j + startOfRow;
      });
  });
};

describe("page getter", () => {
  it("...", () => {
      const getPages5 = getPages();
      let pages = getPages5(5, 1);
      expect(pages).toEqual([[1, 2, 3, 4, 5]]);
      pages = getPages5(8, 2);
      expect(pages).toEqual([[2, 3, 4, 5, 6], [7, 8]]);
      const getPages3 = getPages(3);
      pages = getPages3(1, 1);
      expect(pages).toEqual([[1]]);
      pages = getPages3(10, 4);
      expect(pages).toEqual([[4,5,6],[7,8,9],[10]])
  });
})