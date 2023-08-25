export const indexedOp = <A,B,C>(op:(c:C, b:B) => B, start: B, i: (a: A) => C, col: A[]): B => {
    return col.reduce((a, x) => op(i(x),a), start);
};

export const indexedAnd = <A>(i:(a:A) => boolean, col: A[]) => {
    return indexedOp(((b1:boolean,b2:boolean) => b1 && b2), true, i, col);
};

/**
 * Check if an array is a subset of another array.
 * @param a1 The subset.
 * @param a2 The superset.
 * @returns `true` when `a1` is a subset of `a2`.
 */
export const subsetOf = <A>(a1: A[], a2: A[]): boolean => {
    return a1.every((val) => a2.includes(val));
};

export const mapUnion = <A,B>(a1: A[], a2: B[], f: (x:B) => A): A[] => {
    return a1.concat(a2.flatMap(f));
};