export const sampleText = `You Probably Don't Need Derived State
June 07, 2018 by Brian Vaughn
React 16.4 included a bugfix for getDerivedStateFromProps which caused some existing bugs in React components to reproduce more consistently. If this release exposed a case where your application was using an anti-pattern and didn’t work properly after the fix, we’re sorry for the churn. In this post, we will explain some common anti-patterns with derived state and our preferred alternatives.

For a long time, the lifecycle componentWillReceiveProps was the only way to update state in response to a change in props without an additional render. In version 16.3, we introduced a replacement lifecycle, getDerivedStateFromProps to solve the same use cases in a safer way. At the same time, we’ve realized that people have many misconceptions about how to use both methods, and we’ve found anti-patterns that result in subtle and confusing bugs. The getDerivedStateFromProps bugfix in 16.4 makes derived state more predictable, so the results of misusing it are easier to notice.

Note

All of the anti-patterns described in this post apply to both the older componentWillReceiveProps and the newer getDerivedStateFromProps.

This blog post will cover the following topics:

When to use derived state
Common bugs when using derived state

Anti-pattern: Unconditionally copying props to state
Anti-pattern: Erasing state when props change
Preferred solutions
What about memoization?
When to Use Derived State
getDerivedStateFromProps exists for only one purpose. It enables a component to update its internal state as the result of changes in props. Our previous blog post provided some examples, like recording the current scroll direction based on a changing offset prop or loading external data specified by a source prop.

We did not provide many examples, because as a general rule, derived state should be used sparingly. All problems with derived state that we have seen can be ultimately reduced to either (1) unconditionally updating state from props or (2) updating state whenever props and state don’t match. (We’ll go over both in more detail below.)

If you’re using derived state to memoize some computation based only on the current props, you don’t need derived state. See What about memoization? below.
If you’re updating derived state unconditionally or updating it whenever props and state don’t match, your component likely resets its state too frequently. Read on for more details.
Common Bugs When Using Derived State
The terms “controlled” and “uncontrolled” usually refer to form inputs, but they can also describe where any component’s data lives. Data passed in as props can be thought of as controlled (because the parent component controls that data). Data that exists only in internal state can be thought of as uncontrolled (because the parent can’t directly change it).

The most common mistake with derived state is mixing these two; when a derived state value is also updated by setState calls, there isn’t a single source of truth for the data. The external data loading example mentioned above may sound similar, but it’s different in a few important ways. In the loading example, there is a clear source of truth for both the “source” prop and the “loading” state. When the source prop changes, the loading state should always be overridden. Conversely, the state is overridden only when the prop changes and is otherwise managed by the component.

Problems arise when any of these constraints are changed. This typically comes in two forms. Let’s take a look at both.

Anti-pattern: Unconditionally copying props to state
A common misconception is that getDerivedStateFromProps and componentWillReceiveProps are only called when props “change”. These lifecycles are called any time a parent component rerenders, regardless of whether the props are “different” from before. Because of this, it has always been unsafe to unconditionally override state using either of these lifecycles. Doing so will cause state updates to be lost.

Let’s consider an example to demonstrate the problem. Here is an EmailInput component that “mirrors” an email prop in state:

class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // This will erase any local state updates!
    // Do not do this.
    this.setState({ email: nextProps.email });
  }
}It is also worth re-iterating that getDerivedStateFromProps (and derived state in general) is an advanced feature and should be used sparingly because of this complexity. If your use case falls outside of these patterns, please share it with us on GitHub or Twitter!`;
