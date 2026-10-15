import { test, describe, beforeEach, expect } from 'vitest';
import { store } from '@/src/store';
import { selectCount, increment, decrement, incrementByAmount, reset } from '@/src/store/slices/counterSlice';

// Locks in the store's shape and reducer wiring: a fresh store boots at the
// counter's initial state, and dispatched actions flow through the reducer.
describe('app store', () => {
  beforeEach(() => {
    store.dispatch(reset());
  });

  test('boots with the counter slice at its initial value', () => {
    expect(selectCount(store.getState())).toBe(0);
  });

  test('exposes the counter slice under state.counter', () => {
    const state = store.getState();
    expect(state.counter).toBeDefined();
    expect(typeof state.counter.value).toBe('number');
  });

  test('dispatching increment/decrement updates state through the store', () => {
    store.dispatch(increment());
    store.dispatch(increment());
    store.dispatch(decrement());
    expect(selectCount(store.getState())).toBe(1);
  });

  test('incrementByAmount applies the payload and reset clears it', () => {
    store.dispatch(incrementByAmount(5));
    store.dispatch(incrementByAmount(-2));
    expect(selectCount(store.getState())).toBe(3);
    store.dispatch(reset());
    expect(selectCount(store.getState())).toBe(0);
  });
});
