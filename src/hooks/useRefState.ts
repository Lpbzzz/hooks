import { useState, useRef, useEffect } from 'react';

function useRefState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void, React.MutableRefObject<T>] {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return [state, setState, stateRef];
}

export default useRefState;