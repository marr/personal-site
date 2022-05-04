import { expect, describe, it } from "vitest";

const getPages =
    (length = 5) =>
    (max, start) => {
        const numArrays = Math.ceil((max - start + 1) / length);
        return Array.from({ length: numArrays }, (_, i) => {
            const startOfRow = i * length + start;
            const arrLength = Math.min(max - startOfRow + 1, length);
            return Array.from({ length: arrLength }, (_, j) => {
                return j + startOfRow;
            });
        });
    };

const weirdMirror = (colCount) => {
    return function (length) {
        let reverse = false;
        let col = 0;
        return Array.from({ length }, (_, i) => {
            if (i > 0 && i % colCount === 0) {
                reverse = !reverse;
                col = i;
            }
            return reverse ? col + Math.abs((i % colCount) - colCount) : i + 1;
        });
    };
};

// flattener
const flatten = (node, flattened = [node.item]) => {
    node.children?.map((child) => {
        flattened.push(child.item);
        flatten(child, flattened);
    });
    return flattened;
}

// https://stackoverflow.com/questions/48524059/how-to-flatten-tree-structure-into-array-of-arrays/72104665#72104665
function traverse(node, path = [], result = []){
    if(!node.children.length)
       result.push(path.concat(node.item));
    for(const child of node.children)
        traverse(child, path.concat(node.item), result);
    return result;
}

describe("flatten tree", () => {
    it("flattens a tree", () => {
        const tree = { item: 'a', children: [{ item: 'b'}, { item: 'c', children: [{ item: 'd'}]}] }
        expect(flatten(tree)).toEqual(['a', 'b', 'c', 'd']);
    });
})

describe("traverse node", () => {
    it("makes a map", () => {
        var node = {
            item: 1,
            children: [
              {
                item: 2,
                children: [
                  {
                    item: 3,
                    children: [
                      {
                        item: 4,
                        children: []
                      },
                      {
                        item: 5,
                        children: []
                      },
                      {
                        item: 6,
                        children: [
                          {
                            item: 7,
                            children: []
                          },
                          {
                            item: 8,
                            children: []
                          },
                          {
                            item: 9,
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    item: 10,
                    children: [
                      {
                        item: 11,
                        children: []
                      },
                      {
                        item: 12,
                        children: [
                          {
                            item: 13,
                            children: []
                          },
                          {
                            item: 14,
                            children: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
          const expected = traverse(node);
          expect(expected).toEqual([
            [1, 2, 3, 4],
            [1, 2, 3, 5],
            [1, 2, 3, 6, 7],
            [1, 2, 3, 6, 8],
            [1, 2, 3, 6, 9],
            [1, 2, 10, 11],
            [1, 2, 10, 12, 13],
            [1, 2, 10, 12, 14]
          ])
    })
   
});

describe("do weird array stuff", () => {
    it("mirrors?", () => {
        const f = weirdMirror(3);
        expect(f(12)).toEqual([1, 2, 3, 6, 5, 4, 7, 8, 9, 12, 11, 10]);
        const f5 = weirdMirror(5);
        expect(f5(10)).toEqual([1, 2, 3, 4, 5, 10, 9, 8, 7, 6]);
        const f2 = weirdMirror(2);
        expect(f2(10)).toEqual([1, 2, 4, 3, 5, 6, 8, 7, 9, 10]);
    });
});

describe("page getter", () => {
    it("...", () => {
        const getPages5 = getPages();
        let pages = getPages5(5, 1);
        expect(pages).toEqual([[1, 2, 3, 4, 5]]);
        pages = getPages5(8, 2);
        expect(pages).toEqual([
            [2, 3, 4, 5, 6],
            [7, 8],
        ]);
        const getPages3 = getPages(3);
        pages = getPages3(1, 1);
        expect(pages).toEqual([[1]]);
        pages = getPages3(10, 4);
        expect(pages).toEqual([[4, 5, 6], [7, 8, 9], [10]]);
    });
});
