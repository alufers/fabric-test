import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import createFabricObject from "../studio/object";
import useCanvas from "./../hooks/useCanvas";
import ChangeColorButton from "./ChangeColorButton";

const CanvasEl = styled.canvas`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
`;

const CanvasComponent = memo(({ canvasRef }) => <CanvasEl ref={canvasRef} />);

const Canvas = () => {
  const [objects, setObjects] = useState(
    Array(5)
      .fill(null)
      .map((_, i) => createFabricObject({ left: i * 220, top: i * 75 }))
  );
  const [canvasRef, fabricCanvas] = useCanvas(objects);
  const [objectPositions, setObjectPositions] = useState([]);

  // this callback syncs the object positions from fabric with react
  const updateObjectPositions = useCallback(() => {
    setObjectPositions(
      objects.map((o) => {
        return {
          object: o,
          top: o.top,
          left: o.left,
          angle: o.angle,
        };
      })
    );
  }, [objects]);

  // this object updates an object's color
  const changeColor = useCallback((object) => {
    object.set({
      fill: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
    fabricCanvas.renderAll(); // force a re-render
  });

  // at initialization time we bind event listeners to the objects and get their initial positions
  useEffect(() => {
    setObjectPositions(
      objects.map((o) => {
        // clear all event listeners from previous invocations

        if (o.__eventListeners) {
          o.__eventListeners["moving"] = [];
          o.__eventListeners["rotating"] = [];
          o.__eventListeners["scaling"] = [];
        }
        o.on("moving", () => {
          updateObjectPositions();
        });
        o.on("rotating", () => {
          updateObjectPositions();
        });
        o.on("scaling", () => {
          updateObjectPositions();
        });

        return {
          object: o,
          top: o.top,
          left: o.left,
          angle: o.angle,
        };
      })
    );
  }, [objects, updateObjectPositions]);

  return (
    <div>
      <CanvasComponent canvasRef={canvasRef} />
      {objectPositions.map((o, i) => (
        <ChangeColorButton
          key={i}
          left={o.left}
          top={o.top}
          angle={o.angle}
          onClick={() => changeColor(o.object)}
        >
          Change color
        </ChangeColorButton>
      ))}
    </div>
  );
};

export default Canvas;
