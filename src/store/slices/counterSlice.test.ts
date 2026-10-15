import { test, describe } from 'vitest';
import assert from 'node:assert';
import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
  reset,
  selectCount,
} from '@/src/store/slices/counterSlice';
import type { RootState } from '@/src/store';

// The counter slice's state is the object shape `{ value: number }`
// (initialState is `{ value: 0 }`), so reducer tests pass that object shape.
describe('counterSlice reducer', () => {
  test('starts at zero', () => {
    assert.deepStrictEqual(counterReducer({ value: 0 }, { type: '@@INIT' }), {
      value: 0,
    });
  });

  test('increment adds one', () => {
    assert.strictEqual(counterReducer({ value: 0 }, increment()).value, 1);
    assert.strictEqual(counterReducer({ value: 5 }, increment()).value, 6);
  });

  test('decrement subtracts one', () => {
    assert.strictEqual(counterReducer({ value: 3 }, decrement()).value, 2);
    assert.strictEqual(counterReducer({ value: 0 }, decrement()).value, -1);
  });

  test('incrementByAmount adds the payload', () => {
    assert.strictEqual(counterReducer({ value: 0 }, incrementByAmount(4)).value, 4);
    assert.strictEqual(
      counterReducer({ value: 10 }, incrementByAmount(-3)).value,
      7,
    );
  });

  test('reset returns to zero from any value', () => {
    assert.strictEqual(counterReducer({ value: 42 }, reset()).value, 0);
  });

  test('unknown action leaves state unchanged', () => {
    assert.strictEqual(
      counterReducer({ value: 7 }, { type: 'unknown' }).value,
      7,
    );
  });
});

describe('selectCount', () => {
  test('reads the counter value from a RootState-shaped object', () => {
    const state = { counter: { value: 9 } } as unknown as RootState;
    assert.strictEqual(selectCount(state), 9);
  });
});
