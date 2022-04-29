import { expect, describe, it } from 'vitest';
import { deepMerge } from '~/utils/general';

const obj = {
    data: [{
        id: '1',
        name: 'dave'
    }],
    includes: {
        users: [{
            id: '1',
            name: 'foo'
        }]
    }
}

deepMerge(obj, {
    data: [{
        id: '2',
        name: 'bbb'
    }],
    includes: {
        media: [],
        users: [{
            id: '2',
            name: 'bar'
        },
        {
            id: '1',
            name: 'zzz',
            age: 22
        }
    ]
    }
});

describe("utils/general", () => {
    describe("deepMerge", () => {
        it("merges arrays deeply", () => {
            expect(obj.data).toHaveLength(2);
            expect(obj.includes.users).toHaveLength(3)
        })
    })
})