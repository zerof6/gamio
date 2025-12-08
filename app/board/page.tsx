'use client';
import { useState } from 'react';
import EditableBoardElement from '../components/editable-board-element';
import DragHandler from '../components/drag-handler';
import { BoardElement } from '@/app/types'

const Page = (): React.JSX.Element => {
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [boardElements, setBoardElements] = useState<Array<BoardElement>>([
    {
      id: '1',
      class: 'cla',
      data: { bgColor: '#0ff000' },
      bounds: { t: 50, r: 400, b: 400, l: 50 }
    },
    { id: '2', class: 'clb', data: {} },
  ]);

  const setActiveElement = (id: string | null) => () => {
    setActiveElementId(id);
  };

  return (
    <main>
      <div>
        {boardElements.map((element, idx) => (
          <EditableBoardElement
            key={element.id}
            bounds={element.bounds}
            divProps={{
              className: `flex flex-col`,
              style: {
                backgroundColor: element.data.bgColor,
              },
            }}
            active={activeElementId === element.id}
            onActive={setActiveElement(element.id)}
            index={idx + 1}
          >
            <DragHandler active={activeElementId === element.id}>
              <div className="w-full h-8 bg-amber-500">Drag Handle</div>
            </DragHandler>
            <div className="w-full flex-1">
              <button onClick={() => console.log('click Works bb')}>CTA</button>
            </div>
          </EditableBoardElement>
        ))}
      </div>
    </main>
  );
};

export default Page;
