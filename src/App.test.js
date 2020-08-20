import React from 'react';
import {render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import App from './App';
import {arrowDown, space} from "./KeyCodes";

test('User can move an item from source tray to single column layout area', async () => {
  jest.setTimeout(1000000);
  jest.useFakeTimers();
  Object.defineProperties(document.documentElement, {
    clientHeight: {
      value: 10000,
      writable: true
    },
    clientWidth: {
      value: 2650,
      writable: true
    }
  });

  render(<App/>);

  const sourceTray = screen.getByTestId('source-tray');
  Object.defineProperties(sourceTray, {
    clientHeight: {
      value: 120,
      writable: true
    },
    clientWidth: {
      value: 2650,
      writable: true
    },
    getBoundingClientRect: {
      value: jest.fn(() => {
        console.log('sourceTray bounding client rect');
        return {
          "x": 0,
          "y": 0,
          "width": 2560,
          "height": 20,
          "top": 0,
          "right": 2560,
          "bottom": 20,
          "left": 0
        };
      }),
      writable: true
    }
  });
  const singleColumnLayoutArea = screen.getByTestId(
    'single-column-layout-area'
  );
  Object.defineProperties(singleColumnLayoutArea, {
    clientHeight: {
      value: 200,
      writable: true
    },
    clientWidth: {
      value: 2650,
      writable: true
    },
    getBoundingClientRect: {
      value: jest.fn(() => {
        console.log('singleColumnLayoutArea bounding client rect');
        return {
          "x": 0,
          "y": 20,
          "width": 2560,
          "height": 100,
          "top": 20,
          "right": 2560,
          "bottom": 120,
          "left": 0
        };
      }),
      writable: true
    }
  });

  const itemRectBeforeMove = {
    "x": 0,
    "y": 0,
    "width": 2560,
    "height": 20,
    "top": 0,
    "right": 2560,
    "bottom": 20,
    "left": 0
  };
  const itemRectAfterMove = {
    "x": 0,
    "y": 20,
    "width": 2560,
    "height": 20,
    "top": 20,
    "right": 2560,
    "bottom": 40,
    "left": 0
  };
  const itemGetBoundingClientRect = jest.fn();
  itemGetBoundingClientRect.mockImplementationOnce(() => {
    console.log('item bounding rect 1');
    return itemRectBeforeMove;
  });
  itemGetBoundingClientRect.mockImplementationOnce(() => {
    console.log('item bounding rect 2');
    return itemRectBeforeMove;
  });
  itemGetBoundingClientRect.mockImplementationOnce(() => {
    console.log('item bounding rect 3');
    return itemRectAfterMove;
  });

  const item = screen.getByTestId('library-item-card');
  Object.defineProperties(item, {
    clientHeight: {
      value: 20,
      writable: true
    },
    clientWidth: {
      value: 2650,
      writable: true
    },
    getBoundingClientRect: {
      value: itemGetBoundingClientRect,
      writable: true
    }
  });
  expect(sourceTray).toContainElement(item);
  expect(singleColumnLayoutArea).not.toContain(item);

  fireEvent.focus(item);
  fireEvent.keyDown(item, {keyCode: space});
  jest.runOnlyPendingTimers();

  act(() => {
    fireEvent.keyDown(item, {keyCode: arrowDown});
    jest.runOnlyPendingTimers();
  });

  fireEvent.keyDown(item, {keyCode: space});
  jest.runOnlyPendingTimers();


  await waitFor(() => {
    const itemAgain = screen.getByTestId('library-item-card');
    expect(sourceTray).not.toContainElement(itemAgain);
    expect(singleColumnLayoutArea).toContainElement(itemAgain);
  });
});
