Project in development — Check out editable-board-element for an implementation of a draggable and resize-able component with the following features

Draggable via react-draggable's DraggableCore (custom handle .handle)
Resizable via a ResizeBars child that calls back to onResize / onResizeStop
Constrains position and size to configurable bounds (top/right/bottom/left)
Initial position prop with clamping against bounds on mount
Minimum size via minWidth / minHeight props
Live updates using CSS transform (translate(x,y)) for smooth, GPU-accelerated moves
Position stored in a ref (positionRef) to avoid rerenders while dragging
Size kept in state and updated on resize stop
Node ref passed to DraggableCore (nodeRef={boardElementRef})
Drag cancel selector set to .resize-bar to avoid conflict with resize handles
Unique DOM id using useId via useUniqueId helper
Simple styling and slot for content (button shown in sample)
Absolute positioning with box-sizing awareness for predictable layout