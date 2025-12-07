import React, { forwardRef, useContext } from "react";
import { EditableBoardElementContext } from "./editable-board-element";
const DragHandler = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  function DragHandler({ children }, ref) {
    const { isDragging, hasRightParent } = useContext(EditableBoardElementContext);

    if (!hasRightParent) {
      throw new Error("DragHandler must be used within an EditableBoardElement component");
    }

    return (
      <div
        ref={ref}
        className={`handle ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {children}
      </div>
    );
  }
);

export default DragHandler;