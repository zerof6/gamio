import React, { forwardRef, useContext } from "react";
import { EditableBoardElementContext } from "./editable-board-element";
const DragHandler = forwardRef<HTMLDivElement, { children: React.ReactNode, active: boolean }>(
  function DragHandler({ children, active }, ref) {
    const { isDragging, hasRightParent } = useContext(EditableBoardElementContext);

    if (!hasRightParent) {
      throw new Error("DragHandler must be used within an EditableBoardElement component");
    }

    return (
      <div
        ref={ref}
        className={`handle ${!active? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {children}
      </div>
    );
  }
);

export default DragHandler;