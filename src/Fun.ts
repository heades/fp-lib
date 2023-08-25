export const compose = <A,B,C>(f2: (x:B) => C, f1 : (x:A) => B): (x:A) => C => {
    return (x:A) => f2(f1(x));
};

export const curry = <A,B,C>(f:(x:A,y:B) => C): ((x:A) => (y:B) => C) => {
    return ((x:A) => (y:B) => f(x,y));
};