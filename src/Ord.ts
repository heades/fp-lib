interface LT {
    type: "LT"
};

export const mkLT = (): LT => {
    return {
        type: 'LT'
    };
};

interface GT {
    type: "GT"
};

export const mkGT = (): GT => {
    return {
        type: 'GT'
    };
};

interface EQ {
    type: "EQ"
};

export const mkEQ = (): EQ => {
    return {
        type: 'EQ'
    };
};

export type Comparison = LT | GT | EQ;

export interface Ord<V> {
    eq: (v : V) => boolean,
    lt: (v : V) => boolean,
    gt: (v : V) => boolean
};