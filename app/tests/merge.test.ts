import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';

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

mergeWith(obj, {
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
}, (obj, src) => Array.isArray(obj) && Array.isArray(src) ? [...src, ...obj] : undefined);

console.log(obj.includes);
