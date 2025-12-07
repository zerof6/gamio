'use client';
import EditableBoardElement from '../components/editable-board-element';
import DragHandler from '../components/drag-handler';
const Page = (): React.JSX.Element => {
  return (
    <main>
      <div>
        <EditableBoardElement
          divProps={{ className: `flex flex-col`, style:{
            backgroundColor: '#0ff000',
          } }}
        >
          <DragHandler>
            <div
              className="w-full h-8 bg-amber-500"
            >
              Drag Handle
            </div>
          </DragHandler>
          <div className="w-full flex-1">
            <button onClick={() => console.log('click Works bb')}>CTA</button>
          </div>
        </EditableBoardElement> {/* Basic DragItem */}
        <EditableBoardElement bounds={{ t: 50, r: 400, b: 400, l: 50 }}>
          <DragHandler>
            <div
              className="w-full h-8 bg-amber-500"
            >
              Drag Handle
            </div>
          </DragHandler>
          <div className="w-full flex-1">
            <button onClick={() => console.log('click Works bb')}>CTA</button>
          </div>
        </EditableBoardElement>{/* DragItem with bounds */}
      </div>
    </main>
  );
};

export default Page;
