import { useRef, useState } from 'react';
import { matchesIgnoreCondition } from 'utils';


interface UseProxyClickProps<T> {
  onClick: (e: MouseEvent, record: T) => void;
  dragThreshold?: number;
  ignoreConditions?: Array<string | ((element: HTMLElement) => boolean)>;
}

const useProxyClick = <T>(props: UseProxyClickProps<T>) => {
  const { onClick, dragThreshold = 5, ignoreConditions } = props;

  const [isDragging, setIsDragging] = useState(false);
  const startPosition = useRef<null | { x: number; y: number }>(null);
  const endPosition = useRef<null | { x: number; y: number }>(null);

  const onMouseDown = (mouseDownEvent: MouseEvent) => {
    const targetElement = mouseDownEvent.target as HTMLElement;

    if (matchesIgnoreCondition(targetElement, ignoreConditions??[])) {
      return; // 如果满足忽略条件，不记录起始位置
    }

    startPosition.current = {
      x: mouseDownEvent.clientX,
      y: mouseDownEvent.clientY,
    };
    setIsDragging(false);
  };

  const onMouseUp = (mouseUpEvent: MouseEvent, record: T) => {
    endPosition.current = { x: mouseUpEvent.clientX, y: mouseUpEvent.clientY };
    // 如果发生拖拽，不触发 onClick
    if (isDragging) {
      setIsDragging(false); // 重置拖拽状态
    } else {
      let currentElement = mouseUpEvent.target as HTMLElement | null;
      let foundNoParentClick = false;

      // 循环查找父级元素，直到到达当前元素的根节点
      // 或符合自定义设置的忽略点击事件的元素
      while (currentElement && currentElement !== mouseUpEvent.currentTarget) {
        if (
          (currentElement.tagName === 'INPUT' && currentElement.getAttribute('type') === 'checkbox') ||
          matchesIgnoreCondition(currentElement, ignoreConditions??[])
        ) {
          foundNoParentClick = true;
          break;
        }

        currentElement = currentElement.parentElement;
      }

      // 如果没有找到符合条件的元素，则执行 onClick 处理函数
      if (!foundNoParentClick) {
        onClick && onClick(mouseUpEvent, record);
      }
    }
  };

  const onMouseMove = (mouseMoveEvent: MouseEvent) => {
    if (startPosition.current) {
      const deltaX = mouseMoveEvent.clientX - startPosition.current.x;
      const deltaY = mouseMoveEvent.clientY - startPosition.current.y;
      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        setIsDragging(true);
      }
    }
  };

  return { onMouseDown, onMouseUp, onMouseMove };
};

export default useProxyClick;
