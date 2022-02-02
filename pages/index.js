import { useRef, useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Grid from "../components/Grid";

export default function Home() {
  const width = 20;
  const height = 10;
  const gridRef = useRef();
  const [key, setKey] = useState(1);
  const [grid, setGrid] = useState(
    <Grid width={width} height={height} key={key} ref={gridRef} />
  );

  // States for dynamic button values
  const [solving, setSolving] = useState(false);
  const [solveButtonText, setSolveButtonText] = useState("Solve");

  useEffect(() => {
    // Increment key
    setKey((prev) => prev + 1);
  }, [grid]);

  /*
    Clears and creates a new grid
  */
  const clearGrid = () => {
    gridRef.current.stopSolve();
    if (solving) {
      toggleSolve();
    }

    setGrid(<Grid width={width} height={height} key={key} ref={gridRef} />);
  };

  /*
    Changes solve button text
  */
  const toggleSolve = () => {
    if (!solving) {
      setSolveButtonText("Stop");
    } else {
      setSolveButtonText("Solve");
    }
    setSolving((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Pathfinding Visualiser</title>
        <meta
          name="description"
          content="Next.JS based Pathfinder visualiser."
        />
        <meta name="author" content="Pilchh"></meta>
        <meta name="theme-color" content="#ffbb00"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
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
            onClick={() => {
              if (!solving) {
                toggleSolve();
                gridRef.current.bfsSolve();
              } else {
                clearGrid();
              }
            }}
          >
            {solveButtonText}
          </button>
          <button className={styles.clearButton} onClick={() => clearGrid()}>
            Clear
          </button>
        </div>

        {grid}
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerText}>Developed by Pilchh</p>
      </footer>
    </div>
  );
}
