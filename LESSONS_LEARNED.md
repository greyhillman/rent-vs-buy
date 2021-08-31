# Lessons Learned

## React

I can't seem to find the article, but there was an article that refactored some React code into a MVC-like pattern.
The main logic was put into models, the DOM code in their own folder, and then finally the connections into another folder.
I followed that pattern and it turns out to be pretty nice.

### State

I learned that `useState` should only hold what the user has entered; everything else should be computed instead of stored.

When working on the last rent place, I wanted that to be the rest of the years you're considering.
In the beginning, I was storing that info along with the user-entered years for the previous places.
Anytime a user changed the length of a place, I had to re-compute the last place's length and then store it again.
It quickly became complicted:

-   what happens if a user increased a length and the last length would become negative?
-   how would we deal with adding a new place to rent? How about removing?

I remembered the article I mentioned above and refactored the code so the length is computed instead of stored.

### Comparisons

#### Haskell

The `useState` hook is basically implementing a `State` monad from Haskell in JavaScript.

##### `useMemo` and `MonadFix`

In Haskell, [`MonadFix`](https://hackage.haskell.org/package/base-4.15.0.0/docs/Control-Monad-Fix.html) is a type class that denotes a computation that has a [fixed point](https://en.wikipedia.org/wiki/Fixed_point_%28mathematics%29), or a value that it converges to when infinitely recursed.
This is used in `reflex` for operations that create a "feedback cycle", so it will eventually come to definite value.
I believe this follows from the denotational semantics of FRP.

I thought of `useMemo` as essentially meant for that.
However, as I'm writing this, it's definitely not what it's meant for.

#### Functional Reactive Programming

I had previous experience with using `reflex`, a Haskell implementation of functional reactive programming (FRP).
In it, there's two fundamental elements:

-   `Behaviour`: a value over time
-   `Event`: a value at times

which comes from the denotational semantics of FRP.
`reflex` also provides a `Dynamic` value which is a combination of `Behaviour` and `Event`.

As I was using `useState`, I really wanted to comebine both the value and the setter return from `useState` into a single object, as using the array was weird.
I created a `Variable` "struct" to hold the `current` value and a method `update` to change the value, which used the setter from `useState`.
It was at that point that it clicked for me that `Variable` is basically a `Dynamic` value from `reflex`.
That's how I came to create `useDynamic`.

##### Failings

In FRP via `reflex`, time is a discrete value.
In `reflex`'s implementation, these discrete values are frames, like a frame in a stick-note animation.
From the denotational semantics of FRP, we can determine what the correct value is when there's a "feedback loop" in the events.
If A causes B to update and B causes A to update, the frame isn't finished until that computation ends.
To "ensure" this computation ends, `MonadFix` is used.
The frame doesn't end until the fixed point of A and B is reached.

I started using `useMemo` to get around this as it returns the same value as long as the inputs are the same.
So if the value of A doesn't change, then B won't update and cause A to change again too.
But, when A updates B and then B is set to trigger A, A does not get re-evaluated until the next `render` call.
Because of that, React "flickers" when there's a computation that changes "every" frame but eventually converges.
It's this lack of denotational semantics or well-defined semantics that has caused me to change the flow of code, code that would work in a FRP context does not in React.

This was most prevelant when the years being considered is changed and I was storing the years for the last rental place.
When calculating the profit/equity, it would return `NaN` because the last rent place didn't last the rest of the years, as it was still using the previous years being considered.
Say

-   total years = 20
-   rent places
    1. 10 years
    2. 10 years

then total years is changed to 21.
The state would then be

-   total years = 21
-   rent places
    1. 10 years
    2. 10 years

When looking for the rent for the 21st year, there is none; it would return `NaN` instead.

However, the rent place would update itself to be 11 years long and the whole `render` process would go again, giving the correct result.
This is done in a second `render`, giving a "flickering" effect.

To get around the flicker, the method to get the rent for a year was changed to return the final place's rent for anything after the second-to-last place.

## CSS

### Semantic class names

In the HTML specification, it says

> authors are encouraged to use values that describe the _nature of the content_, rather than values that describe the _desired presentation of the content_.

This lines up with my overall philosophy and I applied it to this codebase.
I thought I mention it here as developers often neglect this.

### Parent, Child Styling

A question that popped into my mind when I was dealing with putting spacing between elements was

> when should I use `margin` vs `padding`?

I would change the left `margin` of the renting section and then having to also change the left `margin` of the breakdown section to make sure everything is lined up nice.
But, I could do that with left `padding` on the parent component instead and make sure it's always in sync.

My epiphany was

> `margin` should be used for "parent" components while `padding` should be used for "child" components

The `App` "parent" component can set the spacings between the renting and breakdown section "child" components using `margin` while the renting bad breakdown section "child" components can set the spacing inside their components using `padding`.
`App` can also use `padding` but only on itself.

I'm not 100% sure on this as it's still kind of murky.
But, that's the glimpse at something I saw through the murk.
