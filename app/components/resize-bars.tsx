import { useRef, useEffect } from 'react';
import { ResizeDirection } from '../types';

interface ResizeBarsProps {
  onResizeStart?: (e: MouseEvent, direction: ResizeDirection) => void;
  onResize: (e: MouseEvent, direction: ResizeDirection) => void;
  onResizeStop?: (e: MouseEvent, direction: ResizeDirection) => void;
  barThickness?: number;
  active: boolean;
}

/**
 * ResizeBars
 *
 * Renders invisible resize "hotzones" (sides and corners) around a container and wires mouse events
 * to call provided callbacks while the user drags to resize.
 *
 * The component attaches mousedown listeners to each resize bar and then listens to window
 * mousemove events while dragging. A window mouseup will stop the drag and call the stop callback.
 *
 * @param onResize - Callback invoked continuously during a drag. Receives the MouseEvent and a
 *   direction string indicating which bar is being dragged. Direction values:
 *   'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left'.
 * @param onResizeStop - Callback invoked once when the drag completes (on mouseup). Receives the
 *   MouseEvent and the same direction string as onResize.
 * @param barThickness - Optional thickness (in pixels) for the interactive bars. Defaults to 3.
 *
 * @returns A React.JSX.Element containing the eight resize bars (4 sides + 4 corners). The bars are
 *   visually transparent and positioned absolutely; cursors reflect the resize direction.
 *
 * @remarks
 * - The element attaches listeners directly to DOM nodes and the window; consumers should ensure
 *   the container using this component handles focus/stacking appropriately.
 * - Callbacks are responsible for applying the actual sizing logic based on the received events.
 *
 * @example
 * <ResizeBars
 *   onResize={(e, dir) => { }}
 *   onResizeStop={(e, dir) => { }}
 *   barThickness={3}
 * />
 */

const directions: ResizeDirection[] = [
  'top',
  'right',
  'bottom',
  'left',
  'top-right',
  'bottom-right',
  'bottom-left',
  'top-left',
];

const ResizeBars = ({
  onResizeStart,
  onResize,
  onResizeStop,
  barThickness = 3,
  active,
}: ResizeBarsProps): React.JSX.Element => {
  const activeDirectionRef = useRef<ResizeDirection | null>(null);

  const barRefs = useRef<Record<ResizeDirection, HTMLDivElement | null>>({
    top: null,
    right: null,
    bottom: null,
    left: null,
    'top-right': null,
    'bottom-right': null,
    'bottom-left': null,
    'top-left': null,
  });

  useEffect(() => {
    if (!active) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (activeDirectionRef.current) {
        onResize(e, activeDirectionRef.current);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (activeDirectionRef.current) {
        onResizeStop?.(e, activeDirectionRef.current);
        activeDirectionRef.current = null;
        document.body.classList.remove('resizing-item');
        document.documentElement.style.userSelect = '';
        document.documentElement.style.cursor = '';
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    // Attach mousedown to bars and remember handlers so we can clean them up
    const barElements = barRefs.current;
    const mouseDownHandlers: Partial<Record<ResizeDirection, (e: MouseEvent) => void>> = {};

    directions.forEach((dir) => {
      const el = barElements[dir];
      if (!el) return;

      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        activeDirectionRef.current = dir;
        onResizeStart?.(e, dir);
        document.body.classList.add('resizing-item');
        document.documentElement.style.userSelect = 'none';
        document.documentElement.style.cursor = getComputedStyle(el).cursor;
        console.log(getComputedStyle(el).cursor);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      };

      mouseDownHandlers[dir] = onMouseDown;
      el.addEventListener('mousedown', onMouseDown);
    });

    // Cleanup: remove all per-bar handlers and any window handlers that might remain
    return () => {
      directions.forEach((dir) => {
        const el = barElements[dir];
        const handler = mouseDownHandlers[dir];
        if (el && handler) {
          el.removeEventListener('mousedown', handler);
        }
      });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      activeDirectionRef.current = null;
    };
  }, [onResizeStart, onResize, onResizeStop, active]);

  const barMargin = -(barThickness / 2);

  return (
    <>
      {/* sides */}
      <div ref={(el) => {barRefs.current.top = el}} className="resize-bar top-resize-bar" />
      <div ref={(el) => {barRefs.current.right = el}} className="resize-bar right-resize-bar" />
      <div ref={(el) => {barRefs.current.bottom = el}} className="resize-bar bottom-resize-bar" />
      <div ref={(el) => {barRefs.current.left = el}} className="resize-bar left-resize-bar" />

      {/* corners */}
      <div ref={(el) => {barRefs.current['top-right'] = el}} className="resize-bar top-right-resize-bar" />
      <div ref={(el) => {barRefs.current['bottom-right'] = el}} className="resize-bar bottom-right-resize-bar" />
      <div ref={(el) => {barRefs.current['bottom-left'] = el}} className="resize-bar bottom-left-resize-bar" />
      <div ref={(el) => {barRefs.current['top-left'] = el}} className="resize-bar top-left-resize-bar" />

      <style jsx>{`
        .resize-bar {
          position: absolute;
          background-color: transparent !important;
          z-index: 100;
          cursor: ${active ? 'inherit' : 'default !important'};
        }

        .top-resize-bar,
        .bottom-resize-bar {
          height: ${barThickness}px;
          width: calc(100% - ${barThickness * 2}px);
          left: ${barThickness}px;
          cursor: ns-resize;
        }

        .left-resize-bar,
        .right-resize-bar {
          width: ${barThickness}px;
          height: calc(100% - ${barThickness * 2}px);
          top: ${barThickness}px;
          cursor: ew-resize;
        }

        .top-right-resize-bar,
        .bottom-right-resize-bar,
        .bottom-left-resize-bar,
        .top-left-resize-bar {
          width: ${barThickness - barMargin}px;
          height: ${barThickness - barMargin}px;
        }

        .top-right-resize-bar,
        .bottom-left-resize-bar {
          cursor: nesw-resize;
        }
        .bottom-right-resize-bar,
        .top-left-resize-bar {
          cursor: nwse-resize;
        }

        .top-resize-bar {
          top: ${barMargin}px;
        }
        .right-resize-bar {
          right: ${barMargin}px;
        }
        .bottom-resize-bar {
          bottom: ${barMargin}px;
        }
        .left-resize-bar {
          left: ${barMargin}px;
        }

        .top-right-resize-bar {
          top: ${barMargin}px;
          right: ${barMargin}px;
        }
        .bottom-right-resize-bar {
          bottom: ${barMargin}px;
          right: ${barMargin}px;
        }
        .bottom-left-resize-bar {
          bottom: ${barMargin}px;
          left: ${barMargin}px;
        }
        .top-left-resize-bar {
          top: ${barMargin}px;
          left: ${barMargin}px;
        }
      `}</style>
    </>
  );
};

export default ResizeBars;
