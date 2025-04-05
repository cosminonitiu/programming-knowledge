**Internal Mechanism
Reactive Function Wrappers:**
A signal is essentially a function that internally tracks its dependencies. When a signal is read (e.g., via counter()), Angular registers this dependency. If the signal’s value changes, Angular schedules a re-computation and notifies any computed signals or template bindings.

**Efficient Change Propagation:**
Signals leverage Angular’s change detection mechanism to trigger only necessary updates. This minimizes the “noise” of change detection cycles that may occur with more coarse-grained methods like full component re-renders.

**Comparison with Observables
Synchronous vs. Asynchronous:**
While Observables are designed for asynchronous data streams, signals are optimized for synchronous state updates.

**Subscription Overhead:**
Signals eliminate the need for explicit subscription management. They act like simple functions that automatically trigger updates, reducing the cognitive overhead compared to managing subscriptions manually.

**Declarative State Management:**
With signals, state changes are handled imperatively at a very low level (set/update), but their propagation is declarative—computed signals and effects respond automatically.