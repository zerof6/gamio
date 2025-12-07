'use client';
import EditableBoardElement from '../components/editable-board-element';
const Page = (): React.JSX.Element => {
  return (
    <main>
      <div>
        <EditableBoardElement/>
        <EditableBoardElement bounds={{t:50, r:400, b:400, l:50}}/> {/* DragItem with bounds */}
      </div>
    </main>
  );
};

export default Page;
