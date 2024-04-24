// A generator needs to exist for all values that can be returned by typeof.
// https://stackoverflow.com/questions/69654873/can-i-define-a-typescript-type-as-all-possible-resulting-values-from-typeof
const unused = typeof (1 as never);
export type AllTypeofs = typeof unused;
