# Lessons Learned

## React

At a certain stage, I was finding it difficult to reason about React code.
The `render` functions were getting long and were mixing together business logic, React hooks, and then the React DOM.
I stumbled across [this article](https://sairys.medium.com/react-separating-responsibilities-using-hooks-b9c90dbb3ab9) while looking for something to help.
The code was beautiful!
I had to try the pattern out.

The basic advice of the article is to split the components into 3 parts:

-   business logic
    -   how to calculate true rent, mortgage liability, etc.
-   framework/implementation logic
    -   `useState`, `useEffect`, `useMemo`, etc.
-   presentational component
    -   the `render` function and the React DOM

The code is cleaner by following the pattern because each "thing" relies on less "things".

**Lesson Learned: Split code into business logic, framework/implementation logic, and presentational component.**

### State

For the last place a user rents, I wanted it to automatically cover the remaining years that the user is considering.
If it weren't automatic, a user would have to keep it in sync themselves and risk having a shorter length than needed, which would lead to incorrect results.

In the beginning, the last rent place's length was stored alongside the user-entered years for the previous rent places.
There was 2 events that required the last rent place's length to be re-computed and stored:

-   one of the previous rent place's length changed
-   the years being considered changed

A constraint I had to deal with was ensuring the last rent place's length to be at least 1 year: anything shorter than that would be invalid.
Because of this constraint, the function to update the rent places' lengths would return the previous state's value if the new last rent place's length was invalid.
The code was getting complex and error-prone; something had to change.

I remembered the article mentioned above and refactored the code so the length is just computed: not stored at all.
I also moved the responsiblity of ensuring the years' constraint out of the function; the function only had to compute the last rent place's length.
The code was simpler and cleaner than before.
That's when I realized...

**Lesson Learned: `useState` should be for user-entered data; compute the rest.**

For efficiency purposes, computed data can be "stored" (cached) using `useMemo`, which is what the function is designed for.

### Comparisons with Haskell's `reflex`

`reflex` is a functional reactive programming (FRP) library built in Haskell.
I had played around with it previously but found it difficult when I needed to do something it didn't support.
The basics of FRP were easy to understand and I liked the mathematical underpinnings, which is common in the Haskell community.

While learning React hooks, I quickly started to relate React hooks with FRP in `reflex`.
The main one was how `useState` was sort of like a `Dynamic a` in `reflex`: a combination of a FRP behavior and event.
In fact, the [Dynamic.ts](./src/model/Dynamic.ts) and [Event.ts](./src/model/Event.ts) were created because of that.
After figuring out this relation, programming with `useState` became easier.

However, React is not FRP and lacks any denotation semantics (ei: mathematical underpinnings).
It also was missing ideas from Haskell and functional programming in general that would have made things simpler.

#### FRP

FRP (as used in `reflex`) has [denotational semantics](http://conal.net/papers/push-pull-frp/push-pull-frp.pdf), which is basically a mathematical model of how it works.
In FRP, there are:

-   Behaviours
    -   values over time
-   Events
    -   values at a time

Now, I know very little of the actual math behind FRP, but I have experienced the ["advantage of semantics-driven abstractions"](https://qfpl.io/posts/reflex/basics/events/#the-advantages-of-semantics-driven-abstractions) in this calculator.

In the situtation described above in the "State" section, the years renting for each place was stored in an array, along with the rent place.
The total years being considered was stored separately.
For example, this could be the current data:

-   total years = 20
-   rent places
    1. 10 years
    2. 10 years

A related issue to storing the year for the last rent place was when the total years being considered increased.
When that happens, the profit/equity for renting is calculated _before_ the last rent place is updated.
The data would look like this:

-   total years = 21
-   rent places
    1. 10 years
    2. 10 years

When finding the rent for the last year, the rent lookup function would return `NaN`, as there was no place being rented for that year.

However, during the same update, the last rent place would be updated, so the data would be:

-   total years = 21
-   rent places
    1. 10 years
    2. 11 years

This would cause another `render` update for the page and thus a "flicker" would appear.

This issue is caused by the lack of denotational semantics when there's an update in the same frame as another update.
This is precisely the same issue as in the "advantage of semantics-drivin abstractions" article: an intermediate state is being shown.

`reflex` "solves" this by using Haskell's `MonadFix`.
`MonadFix` denotes a computation that has a [fixed point](https://en.wikipedia.org/wiki/Fixed_point_%28mathematics%29), or, a value that it converges to upon "infinite" "recursion".
If React used FRP, then the DOM wouldn't render until the second update was finished, since no values would change afterwards.

React "gets around" this issue by suggesting developers to ["lift state up"](https://reactjs.org/docs/lifting-state-up.html).

**Lesson Learned: Use semantics-driven abstractions when possible.**

## CSS

### Semantic `class` Names

In the [HTML specification for class](https://html.spec.whatwg.org/multipage/dom.html#global-attributes:classes-2) (found via [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class)), it says

> authors are encouraged to use values that describe the _nature of the content_, rather than values that describe the _desired presentation of the content_.

This lines up with my overall philosophy, so I applied it to this codebase.
This is not a lesson learned, but I thought I mention it here as developers often neglect this.

### Modularization

A question popped into my mind when I was dealing with putting spacing between elements:

> when should I use `margin` vs `padding`?

Changing the left `margin` of the renting section entailed changing the left `margin` of the breakdown section as I wanted the two to line up nicely.
But I could also achieve the same effect by adjusting the left `padding` of the page.
If I did that, there would only be 1 place to change instead of 2.

My epiphany was...

> `margin` should be used for "parent" components while `padding` should be used for "child" components

and, soon after, in the more general sense, ...

> a `ruleset` should only apply to inner elements, not outer elements

I think a lot of developers, myself included, forget that CSS stands for _Cascading Style_ Sheets.
Putting a declaration in a ruleset to affect the element when placed _inside_ another element goes directly against the principles of _Cascading Style_ Sheets.

**Lesson Learned: Rulesets should be for _Cascading Style_ and not _Bubbling Style_.**
