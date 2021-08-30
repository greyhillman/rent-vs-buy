import { useState } from "react";
import { Event } from "./Event";

// This is basically like a Dynamic from Haskell's `reflex` library.
// Because it uses React's `useState` under-the-hood, it does not have
// the same denotational semantics as `reflex` does.
export interface Dynamic<T> {
    readonly current: T;
    readonly update: Event<T>;
}

export function useDynamic<T>(initial: T): Dynamic<T> {
    // Have to use function initializer as passing in a function for `initial`
    // would just evaluate the function.
    const [current, setCurrent] = useState(() => initial);

    return {
        current,
        update: (new_value) => {
            setCurrent((_) => new_value);
        },
    };
}
