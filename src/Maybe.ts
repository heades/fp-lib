export interface Just<T> {
    type: "just",
    value: T
}

export interface Nothing {
    type: "nothing"
}

export type Maybe<T> = Just<T> | Nothing;

export const nothing: Nothing = {type: "nothing"}

export function just<T>(v: T): Just<T> {
    return {type: "just", value: v}
}

export default Maybe;