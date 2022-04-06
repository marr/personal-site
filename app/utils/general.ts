import mergeWith from 'lodash/mergeWith';

const arrayMerge = (obj: any, src: any) => {
    if (Array.isArray(obj) && Array.isArray(src)) {
        return [...src, ...obj];
    }
}

export const deepMerge = (obj: any, src: any) => mergeWith(obj, src, arrayMerge);

export const sortByField = (fieldName: any, sortFunc: any) => {
    if (typeof fieldName === 'function') {
        return (a: any, b: any) => sortFunc(fieldName(a), fieldName(b));
    }
    return (a: any, b: any) => sortFunc(a[fieldName], b[fieldName]);
};