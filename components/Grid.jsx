import { forwardRef, useImperativeHandle, useState } from "react";
import styles from "../styles/Grid.module.css";
import { CellTypes } from "../utils/types";

const Grid = forwardRef(({ width, height }, ref) => {
  const enableDiagonals = false;
  let isMouseDown = false;
  let initialCellState = false;
  let cells = [];
  let nextID = 0;

  const createGrid = (width, height) => {
    let grid = [];
    let rowCount = 0;
    for (let i = 0; i < height; i++) {
      let colCount = 0;
      let cellRow = [];
      for (let i = 0; i < width; i++) {
        cellRow.push(createCell(rowCount, colCount));
        colCount++;
      }
      grid.push(cellRow);
      rowCount++;
    }

    let renderRows = [];
    grid.map((row, idx) => {
      renderRows.push(
        <div className={styles.row} key={`row-${idx}`}>
          {row}
        </div>
      );
    });

    return (
      <div className={styles.grid} id="grid">
        {renderRows}
      </div>
    );
  };

  const createCell = (row, col) => {
    const newCell = (
      <button
        className={styles.cell}
        id={nextID}
        key={nextID}
        onMouseDown={(event) => {
          toggleCell(event);
          isMouseDown = true;
          initialCellState = event.target.classList.contains(styles.cellOn);
        }}
        onMouseUp={() => {
          isMouseDown = false;
        }}
        onMouseOver={(event) => {
          if (isMouseDown) {
            initialCellState ? activateCell(event) : deactivateCell(event);
          }
        }}
      ></button>
    );
    cells.push({
      id: nextID,
      cell: newCell,
      type: CellTypes.VOID,
      row: row,
      col: col,
      distance: null,
    });
    nextID++;
    return newCell;
  };

  const updateCellType = (id, update) => {
    let selectedCell = cells[id];

    selectedCell.type = update;
  };

  const toggleCell = (event) => {
    let cell = event.target;

    if (event.shiftKey) {
      let initialOcc = cells.find((obj) => obj.type === CellTypes.INITIAL);
      let destinationOcc = cells.find(
        (cell) => cell.type === CellTypes.DESTINATION
      );

      if (!initialOcc) {
        updateCellType(cell.id, CellTypes.INITIAL);
        cell.classList.add(styles.initialCell);
        return;
      }

      if (initialOcc && !destinationOcc) {
        updateCellType(cell.id, CellTypes.DESTINATION);
        cell.classList.add(styles.destinationCell);
        return;
      }
    }

    let cellState = cell.classList.contains(styles.cellOn);

    cellState
      ? (cells[cell.id].type = CellTypes.VOID)
      : (cells[cell.id].type = CellTypes.BLOCK);
    cell.classList.toggle(styles.cellOn);
  };

  const activateCell = (event) => {
    let cell = event.target;
    cell.classList.add(styles.cellOn);
    updateCellType(cell.id, CellTypes.BLOCK);
  };

  const deactivateCell = (event) => {
    let cell = event.target;
    cell.classList.remove(styles.cellOn);
    updateCellType(cell.id, CellTypes.VOID);
  };

  const getInitialCell = () => {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].type === "initial") {
        return cells[i];
      }
    }
    return -1;
  };

  const getAdjacentVoidCells = (cell) => {
    /*
      Position of cells
            o o o
            o x o
            o o o
    */

    let NWCell;
    let NCell;
    let NECell;

    let WCell;
    let ECell;

    let SWCell;
    let SCell;
    let SECell;

    try {
      if (cell.col === 0 || cell.row === 0) {
        NWCell = null;
      } else if (
        cells[cell.id - width - 1].type === CellTypes.VOID ||
        cells[cell.id - width - 1].type === CellTypes.DESTINATION
      ) {
        NWCell = cells[cell.id - width - 1];
      } else {
        NWCell = null;
      }
    } catch (e) {
      console.log("NW cell blocked");
    }

    try {
      if (cell.row === 0) {
        NCell = null;
      } else if (
        cells[cell.id - width].type === CellTypes.VOID ||
        cells[cell.id - width].type === CellTypes.DESTINATION
      ) {
        NCell = cells[cell.id - width];
      } else {
        NCell = null;
      }
    } catch (e) {
      console.log("N cell blocked");
    }

    try {
      if (cell.col === width - 1 || cell.row === 0) {
        NECell = null;
      } else if (
        cells[cell.id - width + 1].type === CellTypes.VOID ||
        cells[cell.id - width + 1].type === CellTypes.DESTINATION
      ) {
        NECell = cells[cell.id - width + 1];
      } else {
        NECell = null;
      }
    } catch (e) {
      console.log("NE cell blocked");
    }

    try {
      if (cell.col === 0) {
        WCell = null;
      } else if (
        cells[cell.id - 1].type === CellTypes.VOID ||
        cells[cell.id - 1].type === CellTypes.DESTINATION
      ) {
        WCell = cells[cell.id - 1];
      } else {
        WCell = null;
      }
    } catch (e) {
      console.log("W cell blocked");
    }

    try {
      if (cell.col === width - 1) {
        ECell = null;
      } else if (
        cells[cell.id + 1].type === CellTypes.VOID ||
        cells[cell.id + 1].type === CellTypes.DESTINATION
      ) {
        ECell = cells[cell.id + 1];
      } else {
        ECell = null;
      }
    } catch (e) {
      console.log("E cell blocked");
    }

    try {
      if (cell.col === 0 || cell.row === height - 1) {
        SWCell = null;
      } else if (
        cells[cell.id + width - 1].type === CellTypes.VOID ||
        cells[cell.id + width - 1].type === CellTypes.DESTINATION
      ) {
        SWCell = cells[cell.id + width - 1];
      } else {
        SWCell = null;
      }
    } catch (e) {
      console.log("SW cell blocked");
    }

    try {
      if (cell.row === height - 1) {
        SCell = null;
      } else if (
        cells[cell.id + width].type === CellTypes.VOID ||
        cells[cell.id + width].type === CellTypes.DESTINATION
      ) {
        SCell = cells[cell.id + width];
      } else {
        SCell = null;
      }
    } catch (e) {
      console.log("S cell blocked");
    }

    try {
      if (cell.row === height - 1 || cell.col === width - 1) {
        SECell = null;
      } else if (
        cells[cell.id + width + 1].type === CellTypes.VOID ||
        cells[cell.id + width + 1].type === CellTypes.DESTINATION
      ) {
        SECell = cells[cell.id + width + 1];
      } else {
        SECell = null;
      }
    } catch (e) {
      console.log("SE cell blocked");
    }

    let diagObj = [
      { cell: NWCell || null, parent: cell },
      { cell: NCell || null, parent: cell },
      { cell: NECell || null, parent: cell },
      { cell: WCell || null, parent: cell },
      { cell: ECell || null, parent: cell },
      { cell: SWCell || null, parent: cell },
      { cell: SCell || null, parent: cell },
      { cell: SECell || null, parent: cell },
    ];

    let noDiagObj = [
      { cell: NCell || null, parent: cell },
      { cell: WCell || null, parent: cell },
      { cell: ECell || null, parent: cell },
      { cell: SCell || null, parent: cell },
    ];

    return enableDiagonals ? diagObj : noDiagObj;
  };

  const loadDocumentObjectByID = (objID) => {
    return document.getElementById(objID);
  };

  useImperativeHandle(ref, () => ({
    bfsSolve() {
      let queue = [];
      let path = [];
      let searchedCells = [];
      let search = true;
      let found = false;
      let destination;

      const startingCell = {
        cell: getInitialCell(),
        parent: null,
        distance: 0,
      };

      queue.push(startingCell);

      const addAdjacentCells = (startCell) => {
        let adjacentCells = getAdjacentVoidCells(startCell.cell);

        adjacentCells.forEach(() => {
          adjacentCells = adjacentCells.filter((obj) => obj.cell !== null);
        });

        adjacentCells.forEach((obj) => {
          if (obj.cell.type === "destination") {
            found = true;
            destination = obj;
          }
          queue.push(obj);
          searchedCells.push(obj);
          loadDocumentObjectByID(obj.cell.id).classList.add(styles.searchCell);
          cells[obj.cell.id].type = "search";
          cells[obj.cell.id].distance = startCell.cell.distance + 1;
        });

        queue.splice(queue.indexOf(startCell), 1);
      };

      const generatePath = () => {
        path.push(destination);
        while (path.slice(-1)[0].parent.type !== "initial") {
          let parent = path.slice(-1)[0].parent;
          path.push(
            searchedCells.filter((obj) => obj.cell.id === parent.id)[0]
          );
        }
      };

      const colourPath = () => {
        path.reverse();
        path.map((obj, idx) => {
          setTimeout(() => {
            if (idx === path.length - 1) {
              loadDocumentObjectByID(obj.cell.id).classList.remove(
                styles.searchCell
              );
              loadDocumentObjectByID(obj.cell.id).classList.add(
                styles.destinationCell
              );
            } else {
              loadDocumentObjectByID(obj.cell.id).classList.add(styles.path);
            }
          }, 50 * idx);
        });
      };

      let loop = setInterval(() => {
        if (!found && search) {
          try {
            addAdjacentCells(queue[0]);
          } catch (e) {
            console.log("No path or missing nodes");
            search = false;
          }
        }

        if (found && search) {
          clearInterval(loop);
          generatePath();
          colourPath();
        }
      }, 25);
    },
  }));

  return (
    <div onMouseLeave={() => (isMouseDown = false)}>
      {createGrid(width, height)}
    </div>
  );
});

Grid.displayName = "Grid";

export default Grid;
