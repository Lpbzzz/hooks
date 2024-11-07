import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseListenTabVisibleProps {
  visibleCallback?: () => void;
  hiddenCallback?: () => void;
  intersectionObserverOptions?: IntersectionObserverInit;
}

const useListenTabVisibleChange = (props: UseListenTabVisibleProps): React.RefObject<HTMLDivElement> => {
  const { visibleCallback, hiddenCallback, intersectionObserverOptions = {} } = props;
  const [isVisible, setIsVisible] = useState(false);
  const listenElement = useRef<HTMLDivElement | null>(null);

  const observerOptions = useMemo(() => {
    return {
      root: null,
      threshold: 0.1,
      ...intersectionObserverOptions,
    };
  }, [intersectionObserverOptions]);

  const handleVisible = useCallback(() => {
    if (!isVisible) {
      setIsVisible(true);
      visibleCallback?.();
    }
  }, [isVisible, visibleCallback]);

  const handleHidden = useCallback(() => {
    if (isVisible) {
      setIsVisible(false);
      hiddenCallback?.();
    }
  }, [isVisible, hiddenCallback]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleVisible();
        } else {
          handleHidden();
        }
      });
    }, observerOptions);
    const element = listenElement.current;
    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleHidden, handleVisible, listenElement, observerOptions]);

  // remove
  useEffect(() => {
    if (!listenElement.current) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.top = '0';
      div.style.left = '0';
      div.style.width = '1px';
      div.style.height = '1px';
      div.style.opacity = '0';
      document.body.appendChild(div);
      listenElement.current = div;
    }
    return () => {
      if (listenElement.current) {
        document.body.removeChild(listenElement.current);
        listenElement.current = null;
      }
    };
  }, []);

  return listenElement;
};

export default useListenTabVisibleChange;
