export type RecursiveObject<
    O,
    P extends keyof any,
    Optional extends boolean = false
> = Omit<O, P> & (
    P extends keyof O
        ? Optional extends true
            ? { [K in keyof Pick<O, P>]+?:        RecursiveObject<O, P, Optional> }
            : { [K in keyof Pick<O, P>]-?: O[K] | RecursiveObject<O, P, Optional> }
        : Optional extends true
            ? { [K in P]+?: RecursiveObject<O, P, Optional> } 
            : { [K in P]+?: RecursiveObject<O, P, Optional> } 
);
