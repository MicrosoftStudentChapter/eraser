import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import {
  Pencil,
  Eraser,
  Move,
  RotateCcw,
  MousePointerClick,
} from "lucide-react";

const BoardPage = () => {
  const stageRef = useRef(null);
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);

  // Create newline on mouse down
  const handleMouseDown = (e) => {
    if (tool === "pan") return;

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    const stage = e.target.getStage();

    // Convert screen coordinates to stage coordinates
    const transform = stage.getAbsoluteTransform().copy(); //transform matrix contains scale, translation, rotation etc.
    transform.invert(); //reverses the transform matrix
    const relativePos = transform.point(pos);

    //new lines obj and adding to lines array
    setLines([
      ...lines, //keep existing lines
      {
        tool,
        points: [relativePos.x, relativePos.y],
        id: Date.now() + Math.random(), //unique id
      },
    ]);
  };

  //cointinue the recentline created
  const handleMouseMove = (e) => {
    if (!isDrawing || tool === "pan") return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // Convert screen coordinates to stage coordinates
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const relativePos = transform.point(point);

    let newLine = lines[lines.length - 1];
    newLine.points = newLine.points.concat([relativePos.x, relativePos.y]);

    lines.splice(lines.length - 1, 1, newLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Handle wheel zoom
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;

    // Limit zoom levels
    const clampedScale = Math.max(0.1, Math.min(newScale, 5));

    setStageScale(clampedScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    setStagePos(newPos);
  };

  // Handle drag for panning
  const handleDragEnd = (e) => {
    setStagePos({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const clearCanvas = () => {
    setLines([]);
  };

  const resetView = () => {
    setStagePos({ x: 0, y: 0 });
    setStageScale(1);
  };

  return (
    <div className="w-full h-screen bg-[#121417] flex flex-row relative">
      {/* Toolbar */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-4 flex flex-col items-center justify-between z-10">
        <div className="flex flex-col items-center space-y-10">
          <div className="flex flex-col space-y-10">
            <button
              onClick={() => setTool("pointer")}
              className={`p-2 rounded-lg text-white transition-colors`}
              title="Pointer Tool"
            >
              <MousePointerClick size={25} />
            </button>
            <button
              onClick={() => setTool("pen")}
              className={`p-2 rounded-lg text-white transition-colors ${
                tool === "pen" ? "bg-blue-100/15" : "hover:bg-blue-100/15"
              }`}
              title="Pen Tool"
            >
              <Pencil size={25} />
            </button>

            <button
              onClick={() => setTool("eraser")}
              className={`p-2 rounded-lg text-white transition-colors ${
                tool === "eraser" ? "bg-blue-100/15" : "hover:bg-blue-100/15"
              }`}
              title="Eraser Tool"
            >
              <Eraser size={25} />
            </button>

            <button
              onClick={() => setTool("pan")}
              className={`p-2 rounded-lg text-white transition-colors ${
                tool === "pan" ? "bg-blue-100/15" : "hover:bg-blue-100/15"
              }`}
              title="Pan Tool"
            >
              <Move size={25} />
            </button>
          </div>
        </div>
        <div className="p-5"></div>
        <button
          onClick={resetView}
          className="p-2 rounded-lg text-white hover:bg-blue-100/15 transition-colors"
          title="Reset View"
        >
          <RotateCcw size={25} />
        </button>

        <div className="p-4"> </div>

        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative">
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight - 80}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onWheel={handleWheel}
          draggable={tool === "pan"}
          onDragEnd={handleDragEnd}
          x={stagePos.x}
          y={stagePos.y}
          scaleX={stageScale}
          scaleY={stageScale}
        >
          <Layer>
            {/* Drawing lines */}
            {lines.map((line) => (
              <Line
                key={line.id}
                points={line.points}
                stroke={line.tool === "eraser" ? "white" : "white"}
                strokeWidth={line.tool === "eraser" ? 20 : 2}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default BoardPage;