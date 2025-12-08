'use client';
import { useId, useRef, useState, useEffect, useCallback } from 'react';
import ResizeBars from './resize-bars';
import {
  DraggableCore,
  type DraggableEvent,
  type DraggableData,
} from 'react-draggable';
import { clamp } from '../utils/index';
import { ResizeDirection } from '../types';
import { createContext } from 'react';

export function useUniqueId(prefix = 'drag-item'): string {
  const id = useId();
  return `${prefix}-${id.replace(/:/g, '-')}`;
}
interface EditableBoardElementProps {
  children: React.ReactNode;
  divProps?: React.HTMLAttributes<HTMLDivElement>;
  minHeight?: number;
  minWidth?: number;
  bounds?: { t: number; r: number; b: number; l: number };
  position?: { x: number; y: number };
  active?: boolean;
  onActive?: () => void;
  index: number;
}

export const EditableBoardElementContext = createContext({
  isDragging: false,
  hasRightParent: false,
});

const EditableBoardElement = ({
  children,
  divProps,
  minHeight = 100,
  minWidth = 100,
  bounds = { t: -Infinity, r: Infinity, b: Infinity, l: -Infinity },
  position = { x: 0, y: 0 },
  active = false,
  onActive = () => { },
  index,
}: EditableBoardElementProps): React.JSX.Element => {
  const uniqueId = useUniqueId(); // Remove id if not needed
  const boardElementRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<{ x: number; y: number }>({
    x: position.x,
    y: position.y,
  });

  const [size, setSize] = useState({ width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    positionRef.current = {
      x: clamp(position.x, bounds.l, bounds.r - size.width),
      y: clamp(position.y, bounds.t, bounds.b - size.height),
    };
    if (boardElementRef.current) {
      boardElementRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    }
  }, [
    bounds.l,
    bounds.r,
    bounds.t,
    bounds.b,
    position.x,
    position.y,
    size.width,
    size.height,
  ]);

  const getBoundedCoordinates = (
    x: number,
    y: number,
    proposedBounds = bounds
  ): { x: number; y: number } => {
    if (proposedBounds) {
      return {
        x: clamp(x, proposedBounds.l, proposedBounds.r),
        y: clamp(y, proposedBounds.t, proposedBounds.b),
      };
    } else {
      return { x, y };
    }
  };
  const getDragBoundedCoordinates = (
    x: number,
    y: number
  ): { x: number; y: number } => {
    if (!bounds || !boardElementRef.current) return getBoundedCoordinates(x, y);
    return getBoundedCoordinates(x, y, {
      t: bounds.t ?? 0,
      r: Math.max(bounds.r - size.width, bounds.l),
      b: Math.max(bounds.b - size.height, bounds.t),
      l: bounds.l ?? 0,
    });
  };

  const handleDragStart = (_e: DraggableEvent, _data: DraggableData) => {
    if (!active) return;
    setIsDragging(true);
  };

  const drag = (
    e: DraggableEvent,
    data: DraggableData,
    returnPosition: boolean = false
  ): { x: number; y: number } | void => {
    const { x, y } = getDragBoundedCoordinates(
      positionRef.current.x + data.deltaX,
      positionRef.current.y + data.deltaY
    );
    positionRef.current = { x, y };
    boardElementRef.current!.style.transform = `translate(${x}px, ${y}px)`;
    if (returnPosition) {
      return { x, y };
    }
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!active) return;
    drag(e, data);
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    if (!active) return;
    const { x, y } = drag(e, data, true)!;
    positionRef.current = { x, y };
    setIsDragging(false);
  };

  const handleResize = useCallback(
    (e: MouseEvent, direction: ResizeDirection) => {
      if (!active || !boardElementRef.current) return;

      let newWidth = boardElementRef.current.offsetWidth;
      let newHeight = boardElementRef.current.offsetHeight;
      let newX = positionRef.current.x;
      let newY = positionRef.current.y;
      const directions = direction.split('-');

      if (directions.includes('top')) {
        newHeight = clamp(
          boardElementRef.current.offsetHeight - e.movementY,
          minHeight,
          boardElementRef.current.offsetHeight +
            positionRef.current.y -
            bounds.t
        );
        newY = clamp(
          (positionRef.current.y ?? 0) + e.movementY,
          bounds.t,
          (positionRef.current.y ?? 0) +
            boardElementRef.current.offsetHeight -
            minHeight
        );
      }
      if (directions.includes('right')) {
        newWidth = clamp(
          boardElementRef.current.offsetWidth + e.movementX,
          minWidth,
          bounds?.r - (positionRef.current.x ?? 0)
        );
      }
      if (directions.includes('bottom')) {
        newHeight = clamp(
          boardElementRef.current.offsetHeight + e.movementY,
          minHeight,
          bounds?.b - (positionRef.current.y ?? 0)
        );
      }
      if (directions.includes('left')) {
        newWidth = clamp(
          boardElementRef.current.offsetWidth - e.movementX,
          minWidth,
          boardElementRef.current.offsetWidth + positionRef.current.x - bounds.l
        );
        newX = clamp(
          (positionRef.current.x ?? 0) + e.movementX,
          bounds.l,
          (positionRef.current.x ?? 0) +
            boardElementRef.current.offsetWidth -
            minWidth
        );
      }
      positionRef.current = { x: newX, y: newY };
      boardElementRef.current.style.height = `${newHeight}px`;
      boardElementRef.current.style.width = `${newWidth}px`;
      boardElementRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    },
    [minHeight, minWidth, bounds.t, bounds.r, bounds.b, bounds.l, active]
  );

  const handleResizeStop = useCallback(
    (_e: MouseEvent, _direction: ResizeDirection) => {
      if (!active) return;
      setSize((prev) =>
        !boardElementRef.current
          ? prev
          : {
              width: boardElementRef.current.offsetWidth,
              height: boardElementRef.current.offsetHeight,
            }
      );
    },
    []
  );

  return (
    <>
      <EditableBoardElementContext.Provider
        value={{ isDragging, hasRightParent: true }}
      >
        <DraggableCore
          nodeRef={boardElementRef}
          cancel={active ? undefined : '.handle'}
          onStart={handleDragStart}
          onDrag={handleDrag}
          onStop={handleDragStop}
          handle=".handle"
        >
          <div
          onClick={onActive}
            {...divProps}
            ref={boardElementRef}
            id={uniqueId}
            className={`${active ? "border border-gray-400 shadow-lg" : ""} ${divProps?.className}`}
            style={{
              ...divProps?.style,
              width: `${size.width}px`,
              height: `${size.height}px`,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: active ? 99 + index : 9 + index,
              boxSizing: 'border-box',
            }}
          >
            {children}
            <ResizeBars
              onResize={handleResize}
              onResizeStop={handleResizeStop}
              active={active}
            />
          </div>
        </DraggableCore>
      </EditableBoardElementContext.Provider>
    </>
  );
};

export default EditableBoardElement;
