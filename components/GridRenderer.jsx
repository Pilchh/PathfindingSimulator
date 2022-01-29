import React, { useEffect, useState, useRef } from "react";
import Grid from "./Grid";
import styles from "../styles/GridRenderer.module.css";

const GridRenderer = () => {
  const width = 30;
  const height = 12;
  const gridRef = useRef();
  const [enableDiagonals, setEnableDiagonals] = useState(false);
  const [buttonText, setButtonText] = useState("Diagonals Disabled");
  const [key, setKey] = useState(1);
  const [grid, setGrid] = useState(
    <Grid
      width={width}
      height={height}
      enableDiagonals={enableDiagonals}
      key={key}
      ref={gridRef}
    />
  );

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [grid]);

  const clearGrid = () => {
    setGrid(
      <Grid
        width={width}
        height={height}
        enableDiagonals={enableDiagonals}
        key={key}
        ref={gridRef}
      />
    );
  };

  const toggleDiagonals = () => {
    if (!enableDiagonals) {
      setButtonText("Diagonals Disabled");
    } else {
      setButtonText("Diagonals Enabled");
    }
    setEnableDiagonals((prev) => !prev);
  };

  return (
    <>
      <h1 className={styles.title}>
        Breadth-First Search Pathfinding Algorithm
      </h1>
      <div className={styles.instructions}>
        <h2 className={styles.instructionsTitle}>Instructions</h2>
        <ul className={styles.instructionsList}>
          <li>
            Hold down left shift and click on a cell to place the start and
            destination nodes.
          </li>
          <li>Shift-clicking those nodes again will remove them.</li>
          <li>
            Use left click to place any wall nodes in the cells.{" "}
            <span className={styles.bold}>
              Tip: You can also click and drag
            </span>
          </li>
          <li>Click the solve button to start the simulation.</li>
        </ul>
      </div>

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
        <button
          className={styles.diagonalsEnabled}
          onClick={() => {
            toggleDiagonals();
            clearGrid();
          }}
        >
          {buttonText}
        </button>
      </div>

      {grid}
      <p>Developed by Pilchh</p>
    </>
  );
};

export default GridRenderer;
