import Maybe, { just, nothing } from "./Maybe"

interface LT {
    type: "LT"
}

interface GT {
    type: "GT"
}

interface EQ {
    type: "EQ"
}

interface Ord<V> {
    eq: (v : V) => boolean,
    lt: (v : V) => boolean,
    gt: (v : V) => boolean
}

export interface Key<A> extends Ord<A> {
    label: A
}

const mkKey = <A>(label: A, eq: (a : A) => boolean, lt: (a : A) => boolean, gt: (a : A) => boolean): Key<A> => {
    return {
        label: label,        
        lt: lt,
        gt: gt,
        eq : eq
    }
}

const fromKey = <A>(newLabel: A, key: Key<A>): Key<A> => {
    return {
        label: newLabel,
        lt: key.lt,
        gt: key.gt,
        eq: key.eq
    }
}

const compare = <V>(v1: Key<V>, v2: V): LT | GT | EQ => {
    if (v1.lt(v2)) {
        return {type: "LT"}
    } else if (v1.gt(v2)) {
        return {type: "GT"}
    }
    return {type: "EQ"}
}

export const mkKeyString = (v1 : string): Key<string> => {
    return {
        label: v1,
        eq: (v2:string) => v1.localeCompare(v2) == 0,
        lt: (v2:string) => v1.localeCompare(v2) < 0,
        gt: (v2:string) => v1.localeCompare(v2) > 0
    }
}

interface Tip {
    size: 0,
    type: "Tip"
}

const mkTip = <K,V>(): BinTree<K,V> => {
    return {size: 0, type: "Tip"}
}

interface Bin<K,V> {
    size: number,
    key: K,
    value: V,
    left: BinTree<K,V>,
    right: BinTree<K,V>,
    type: "Bin"
}

const mkBin = <K,V>(size: number, key: K, value: V, left: BinTree<K,V>, right: BinTree<K,V>): BinTree<K,V> => {
    return {size: size, key: key, value: value, left: left, right: right, type: "Bin"}
}

const bin = <K,V>(key: K, value: V, left: BinTree<K,V>, right: BinTree<K,V>): BinTree<K,V> => {
    return mkBin(left.size + right.size + 1, key, value, left, right);
}

export type BinTree<K,V> = Tip | Bin<K,V>;

const delta: number = 4;
const ratio: number = 2;

const balance = <K,V>(key: K, value: V, leftMap: BinTree<K,V>, rightMap: BinTree<K,V>): BinTree<K,V> => {
    let sizeX: number = leftMap.size + rightMap.size + 1;

    if (leftMap.size + rightMap.size <= 1) {
        return mkBin(sizeX, key, value, leftMap, rightMap)
    } else if (rightMap.size >= delta*leftMap.size) {
        return rotateLeft(key, value, leftMap, rightMap)
    } else if (leftMap.size >= delta*rightMap.size) {
        return rotateRight(key, value, leftMap, rightMap)
    } else {
        return mkBin(sizeX, key, value, leftMap, rightMap)
    }
}

const singleLeft = <K,V>(key: K, value: V, leftMap: BinTree<K,V>, rightMap: BinTree<K,V>): BinTree<K,V> => {
    switch (rightMap.type) {
        case("Bin"):
            return bin(rightMap.key, rightMap.value, bin(key, value, leftMap, rightMap.left), rightMap.right)
        case("Tip"):
            throw new Error ("singleLeft: Hit the Tip.");
    }
}

const singleRight = <K,V>(key: K, value: V, leftMap: BinTree<K,V>, rightMap: BinTree<K,V>): BinTree<K,V> => {
    switch (leftMap.type) {
        case("Bin"):
            return bin(leftMap.key, leftMap.value, leftMap.left, bin(key, value, leftMap.right, rightMap));
        case("Tip"):
            throw new Error ("singleRight: Hit the Tip.");
    }
}

const doubleLeft = <K,V>(key: K, value: V, leftMap: BinTree<K,V>, rightMap: BinTree<K,V>): BinTree<K,V> => {
    switch (rightMap.type) {
        case("Bin"):
            switch (rightMap.left.type) {
                case("Bin"):
                    return bin(rightMap.left.key, rightMap.left.value, bin(key, value, leftMap, rightMap.left.left), 
                            bin(rightMap.key, rightMap.value, rightMap.left.right, rightMap.right))
                case("Tip"):
                    throw new Error ("doubleLeft: Hit the Tip.");
            }
        case("Tip"):
            throw new Error ("doubleLeft: Hit the Tip.");
    }
}

const doubleRight = <K,V>(key: K, value: V, leftMap: BinTree<K,V>, rightMap: BinTree<K,V>): BinTree<K,V> => {
    switch (leftMap.type) {
        case("Bin"):
            switch (leftMap.right.type) {
                case("Bin"):
                    return bin(leftMap.right.key, leftMap.right.value, bin(leftMap.key, leftMap.value, leftMap.left, leftMap.right.left), 
                        bin(key, value, leftMap.right.right, rightMap));
                case("Tip"):
                    throw new Error ("doubleRight: Hit the Tip.");
            }
        case("Tip"):
            throw new Error ("doubleRight: Hit the Tip.");
    }
}

const rotateLeft = <K,V>(key: K, value: V, leftMap: BinTree<K,V>, rightMap: BinTree<K,V>): BinTree<K,V> => {
    switch (rightMap.type) {
        case("Bin"):
            if (rightMap.left.size < ratio * rightMap.right.size) {
                return singleLeft(key, value, leftMap, rightMap);
            } else {
                return doubleLeft(key, value, leftMap, rightMap);
            }
        case("Tip"):
            throw new Error ("rotateLeft: Hit the Tip.");
    }
}

const rotateRight = <K,V>(key: K, value: V, leftMap: BinTree<K,V>, rightMap: BinTree<K,V>): BinTree<K,V> => {
    switch (leftMap.type) {
        case("Bin"):
            if (leftMap.right.size < ratio*leftMap.left.size) {
                return singleRight(key, value, leftMap, rightMap);
            } else {
                return doubleRight(key, value, leftMap, rightMap);
            }
        case("Tip"):
            throw new Error ("rotateRight: Hit the Tip.");
    }
}

export const empty = <K,V>(): BinTree<K,V> => mkTip();

export const singleton = <K,V>(key: Key<K>, value: V): BinTree<K,V> => mkBin(1, key.label, value, mkTip(), mkTip());

export const insert = <K,V>(key: Key<K>, value: V, map: BinTree<K,V>): BinTree<K,V> => {
    switch (map.type) {
        case("Bin"):
            switch (compare(key, map.key).type) {
                case ("LT"):
                    return balance(map.key, map.value, insert(key, value, map.left), map.right)
                case ("GT"):
                    return balance(map.key, map.value, map.left, insert(key, value, map.right))
                case ("EQ"):
                    return mkBin(map.size, key.label, value, map.left, map.right)
            }
        case("Tip"):
            return singleton(key,value);
    }
}

export const lookup = <K,V>(key: Key<K>, map: BinTree<K,V>): Maybe<V> => {
    switch (map.type) {
        case("Bin"):
            switch (compare(key, map.key).type) {
                case("LT"):
                    return lookup(key, map.left)
                case("GT"):
                    return lookup(key, map.right)
                case("EQ"):
                    return just(map.value)
            }
        case("Tip"):
            return nothing;
    }
}