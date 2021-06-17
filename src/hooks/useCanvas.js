import { useState, useEffect, useRef, useCallback } from "react";
import createFabricCanvas from "./../studio/canvas";
import createFabricObject from "./../studio/object";

const useCanvas = (objects = []) => {
  const ref = useRef();
  const [canvas] = useState(createFabricCanvas());
  useEffect(() => {
    canvas.initialize(ref.current, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const customObject = createFabricObject();

    canvas.renderAll();
  }, [canvas]);

  useEffect(() => {
    const currentObjects = canvas.getObjects();
    // add new objects to the canvas
    for (let obj of objects) {
      if (!currentObjects.includes(obj)) {
        canvas.add(obj);
      }
    }
    // remove old objects from the canvas
    for (let existingObj of currentObjects) {
      if (!objects.includes(existingObj)) {
        canvas.remove(existingObj);
      }
    }
  }, [objects]);

  const setRef = useCallback((node) => {
    ref.current = node;
  });

  return [setRef, canvas];
};

export default useCanvas;
