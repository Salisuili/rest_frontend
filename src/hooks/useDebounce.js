// frontend/src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 * The debounced value will only update after the specified delay
 * when the original value stops changing.
 *
 * @param {any} value The value to debounce.
 * @param {number} delay The delay in milliseconds before the debounced value updates.
 * @returns {any} The debounced value.
 */
function useDebounce(value, delay) {
  // State to store debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function:
    // This will run if 'value' or 'delay' changes (i.e., user types again)
    // or if the component unmounts. It clears the previous timeout,
    // ensuring the handler is only called after the specified delay
    // without new input.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Effect re-runs only if value or delay changes

  return debouncedValue;
}

export default useDebounce;
