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
      <p>
        <span className={styles.bold}>Instructions:</span> Hold down left shift
        and click on a cell to place the start and detination nodes. Use left
        click to place any wall nodes in the cells.
      </p>
      <div className={styles.buttonRow}>
        <button
          className={styles.solveButton}
          onClick={() => gridRef.current.bfsSolve()}
        >
          Solve
        </button>
        <button className={styles.clearButton} onClick={() => clearGrid()}>
          Clear
        </button>
      </div>

      {grid}
    </>
  );
};

export default GridRenderer;
