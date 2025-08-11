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
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); 

  return debouncedValue;
}

export default useDebounce;
