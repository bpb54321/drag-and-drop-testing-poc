import React, {useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

import './App.css';

const singleColumnAreaId = 'single-column-layout-area';
const sourceTrayId = 'source-tray';

const items = [{
  id: 1,
  name: 'Item 1'
}];

function App() {
  const [sourceTrayItems, setSourceTrayItems] = useState(items);
  const [singleColumnAreaItems, setSingleColumnAreaItems] = useState([]);
  return (
    <div className="App">
      <DragDropContext
        onDragStart={(result) => {
          console.log('onDragStart')
        }}
        onDragUpdate={(result) => {
          console.log('onDragUpdate')
        }}
        onDragEnd={(result) => {
          const {destination, draggableId} = result;
          if (destination.droppableId === singleColumnAreaId) {
            const draggedItem = sourceTrayItems.find(
              item => item.id.toString() === draggableId
            );
            setSourceTrayItems(items =>
              items.filter(item => item.id.toString() !== draggableId)
            );
            setSingleColumnAreaItems(items => [...items, draggedItem]);
          }
          console.log('onDragEnd')
        }}
      >
        <Droppable droppableId={sourceTrayId} direction="horizontal">
          {droppableProvided => (
            <div
              className="library-item-card-container"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              data-testid="source-tray"
              style={{
                backgroundColor: 'orange',
                minHeight: '20px'
              }}
            >
              {droppableProvided.placeholder}
              {sourceTrayItems.map((item, index) => (
                <Draggable
                  draggableId={item.id.toString()}
                  index={index}
                  key={item.id}
                >
                  {draggableProvided => (
                    <div
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      ref={draggableProvided.innerRef}
                      data-testid="library-item-card"
                    >{item.name}</div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
        <Droppable droppableId={singleColumnAreaId} ignoreContainerClipping>
          {provided => (
            <div
              className="layout-canvas"
              {...provided.droppableProps}
              ref={provided.innerRef}
              data-testid={singleColumnAreaId}
              style={{
                backgroundColor: 'yellow',
                minHeight: '100px'
              }}
            >
              {provided.placeholder}
              {singleColumnAreaItems.map((item, index) => (
                <Draggable
                  draggableId={item.id.toString()}
                  index={index}
                  key={item.id}
                >
                  {draggableProvided => (
                    <div
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      ref={draggableProvided.innerRef}
                      data-testid="library-item-card"
                    >{item.name}</div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
