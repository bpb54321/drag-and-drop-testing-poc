import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import App from './App';
import {arrowDown, space} from "./KeyCodes";

const sourceTrayRect = {
  "x": 0,
  "y": 0,
  "width": 2560,
  "height": 20,
  "top": 0,
  "right": 2560,
  "bottom": 20,
  "left": 0
};
const singleColumnLayoutAreaRect = {
  "x": 0,
  "y": 20,
  "width": 2560,
  "height": 100,
  "top": 20,
  "right": 2560,
  "bottom": 120,
  "left": 0
};
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
const windowHeight = 10000;
const windowWidth = 2650;

Object.defineProperties(HTMLElement.prototype, {
  getBoundingClientRect: {
    writable: true
  }
});

describe('App', () => {
  beforeEach(() => {
    Object.defineProperties(document.documentElement, {
      clientHeight: {
        value: windowHeight,
      },
      clientWidth: {
        value: windowWidth,
      }
    });
  });
  test('User can move an item from source tray to single column layout area', async () => {
    render(<App/>);

    const sourceTray = screen.getByTestId('source-tray');
    sourceTray.getBoundingClientRect = function () {
      console.log('sourceTray bounding client rect');
      return sourceTrayRect;
    };

    const singleColumnLayoutArea = screen.getByTestId(
      'single-column-layout-area'
    );
    singleColumnLayoutArea.getBoundingClientRect = function () {
      console.log('singleColumnLayoutArea bounding client rect');
      return singleColumnLayoutAreaRect;
    }

    const libraryItemGetBoundingClientRect = jest.fn();
    libraryItemGetBoundingClientRect.mockImplementationOnce(() => {
      console.log('item bounding rect 1');
      return itemRectBeforeMove;
    });
    libraryItemGetBoundingClientRect.mockImplementationOnce(() => {
      console.log('item bounding rect 2');
      return itemRectBeforeMove;
    });
    libraryItemGetBoundingClientRect.mockImplementationOnce(() => {
      console.log('item bounding rect 3');
      return itemRectAfterMove;
    });

    const item = screen.getByTestId('library-item-card');
    item.getBoundingClientRect = libraryItemGetBoundingClientRect;

    expect(sourceTray).toContainElement(item);
    expect(singleColumnLayoutArea).not.toContain(item);

    fireEvent.focus(item);
    fireEvent.keyDown(item, {keyCode: space});

    // Required for state update in react-beautiful-dnd component
    act(() => {
      fireEvent.keyDown(item, {keyCode: arrowDown});
    });

    fireEvent.keyDown(item, {keyCode: space});

    // Must re-query item after it is dropped
    const itemAgain = screen.getByTestId('library-item-card');
    expect(sourceTray).not.toContainElement(itemAgain);
    expect(singleColumnLayoutArea).toContainElement(itemAgain);
  });
});
