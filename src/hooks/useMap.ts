import { useCallback, useState } from 'react';

type UseMapReturn<K, V> = [
  Map<K, V>,
  {
    set: (key: K, value: V) => void;
    setAll: (entries: Iterable<[K, V]>) => void;
    remove: (key: K) => void;
    reset: () => void;
    get: (key: K) => V | undefined;
  },
];

interface UseMapSignature {
  <K, V>(initialMap: Iterable<[K, V]>): UseMapReturn<K, V>;
}

const useMap: UseMapSignature = <K, V>(initialMap: Iterable<[K, V]>): UseMapReturn<K, V> => {
  const [map, setMap] = useState(new Map(initialMap));

  const set = useCallback((key: K, value: V) => {
    setMap((prevState) => {
      const temp = new Map(prevState);
      temp.set(key, value);
      return temp;
    });
  }, []);

  const setAll = useCallback((entries: Iterable<[K, V]>) => {
    setMap(new Map(entries));
  }, []);

  const remove = useCallback((key: K) => {
    setMap((prevState) => {
      const temp = new Map(prevState);
      temp.delete(key);
      return temp;
    });
  }, []);

  const reset = useCallback(() => {
    setMap(new Map(initialMap));
  }, [initialMap]);

  const get = useCallback(
    (key: K) => {
      return map.get(key);
    },
    [map],
  );

  return [map, { set, setAll, remove, reset, get }];
};

export default useMap;