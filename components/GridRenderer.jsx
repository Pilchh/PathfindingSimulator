import React, { useEffect, useState, useRef } from "react";
import Grid from "./Grid";
import styles from "../styles/GridRenderer.module.css";

const GridRenderer = () => {
  const width = 30;
  const height = 15;
  const gridRef = useRef();
  const [key, setKey] = useState(1);
  const [grid, setGrid] = useState(
    <Grid width={width} height={height} key={key} ref={gridRef} />
  );

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [grid]);

  const clearGrid = () => {
    setGrid(<Grid width={width} height={height} key={key} ref={gridRef} />);
  };

  return (
    <>
      <button onClick={() => clearGrid()}>Clear</button>
      <button onClick={() => gridRef.current.solve()}>Solve</button>
      {grid}
    </>
  );
};

export default GridRenderer;
