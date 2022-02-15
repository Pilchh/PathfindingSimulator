import { forwardRef, useImperativeHandle } from "react";
import styles from "../styles/Grid.module.css";
import { CellTypes } from "../utils/types";

const Grid = forwardRef(({ width, height }, ref) => {
  let isMouseDown = false;
  let initialCellState = false;
  let cells = [];
  let nextID = 0;

  /*
    Function generates a grid of set width and height
  */
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

  /*
    Function creates and returns a new cell object
  */
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
    // Add new cell to array
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

  /*
    Function to update the cell type
  */
  const updateCellType = (id, update) => {
    let selectedCell = cells[id];

    selectedCell.type = update;
  };

  const toggleCell = (event) => {
    let cell = cells[event.target.id];
    let cellElement = event.target;

    // If shift key is held
    if (event.shiftKey) {
      // Bool value for if INITIAL cell exists
      let initialOcc = cells.find((obj) => obj.type === CellTypes.INITIAL);
      // Bool value for if DESTINATION cell exists
      let destinationOcc = cells.find(
        (cell) => cell.type === CellTypes.DESTINATION
      );

      // Converts INITIAL cell to VOID
      if (cell.type === CellTypes.INITIAL) {
        updateCellType(cellElement.id, CellTypes.VOID);
        cellElement.classList.remove(styles.initialCell);
        return;
      }

      // Converts DESTINATION cell to VOID
      if (cell.type === CellTypes.DESTINATION) {
        updateCellType(cellElement.id, CellTypes.VOID);
        cellElement.classList.remove(styles.destinationCell);
        return;
      }

      // Create INITIAL cell if not exists
      if (!initialOcc) {
        updateCellType(cellElement.id, CellTypes.INITIAL);
        cellElement.classList.add(styles.initialCell);
        return;
      }

      // Create DESTINATION cell if not exists
      if (initialOcc && !destinationOcc) {
        updateCellType(cellElement.id, CellTypes.DESTINATION);
        cellElement.classList.add(styles.destinationCell);
        return;
      }
    } else {
      // If cell isn't INITIAL or DESTINATION
      if (
        !(
          cellElement.classList.contains(styles.initialCell) ||
          cellElement.classList.contains(styles.destinationCell)
        )
      ) {
        let cellState = cellElement.classList.contains(styles.cellOn);

        // Apply correct type to cell
        cellState
          ? updateCellType(cellElement.id, CellTypes.VOID)
          : updateCellType(cellElement.id, CellTypes.BLOCK);
        cellElement.classList.toggle(styles.cellOn);
      }
    }
  };

  /*
    Functions converts cell to BLOCK type
  */
  const activateCell = (event) => {
    let cell = event.target;

    if (
      !(
        cell.classList.contains(styles.initialCell) ||
        cell.classList.contains(styles.destinationCell)
      )
    ) {
      cell.classList.add(styles.cellOn);
      updateCellType(cell.id, CellTypes.BLOCK);
    }
  };

  /*
    Function converts cell to VOID type
  */
  const deactivateCell = (event) => {
    let cell = event.target;

    if (
      !(
        cell.classList.contains(styles.initialCell) ||
        cell.classList.contains(styles.destinationCell)
      )
    ) {
      cell.classList.remove(styles.cellOn);
      updateCellType(cell.id, CellTypes.VOID);
    }
  };

  /*
    Function returns initial cell obj or returns -1
  */
  const getInitialCell = () => {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].type === CellTypes.INITIAL) {
        return cells[i];
      }
    }
    return -1;
  };

  /*
      Function returns obj containing cells adjacent
      to the cell provided
  */
  const getAdjacentVoidCells = (cell) => {
    /*
      Position of cells are read
      left to right.
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

    /*
      North-West Cell
    */
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
    } catch (e) {}

    /*
      North Cell
    */
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
    } catch (e) {}

    /*
      North-East Cell
    */
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
    } catch (e) {}

    /*
      West Cell
    */
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
    } catch (e) {}
    /*
      East Cell
    */
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
    } catch (e) {}

    /*
      South-West cell
    */
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
    } catch (e) {}

    /*
      South cell
    */
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
    } catch (e) {}

    /*
      South-East cell
    */
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
    } catch (e) {}

    /*
    [
      { cell: NWCell || null, parent: cell },
      { cell: NCell || null, parent: cell },
      { cell: NECell || null, parent: cell },
      { cell: WCell || null, parent: cell },
      { cell: ECell || null, parent: cell },
      { cell: SWCell || null, parent: cell },
      { cell: SCell || null, parent: cell },
      { cell: SECell || null, parent: cell },
    ]
    */

    return [
      { cell: NCell || null, parent: cell },
      { cell: WCell || null, parent: cell },
      { cell: ECell || null, parent: cell },
      { cell: SCell || null, parent: cell },
    ];
  };

  /*
    Returns HTML object with certain ID
  */
  const loadDocumentObjectByID = (objID) => {
    return document.getElementById(objID);
  };

  useImperativeHandle(ref, () => ({
    /*
      Function to solve using BFS
    */
    bfsSolve() {
      let queue = [];
      let searchedCells = [];
      let path = [];
      let search = true;
      let found = false;
      let destination;

      // Create initial cell obj & intialise queue
      const startingCell = {
        cell: getInitialCell(),
        parent: null,
        distance: 0,
      };

      queue.push(startingCell);

      /*
        Function takes each cell in path and assigns it colour
      */
      const addAdjacentCells = (startCell) => {
        let adjacentCells = getAdjacentVoidCells(startCell.cell);

        // Remove null cells
        adjacentCells.forEach(() => {
          adjacentCells = adjacentCells.filter((obj) => obj.cell !== null);
        });

        adjacentCells.forEach((obj) => {
          // Destination cell found
          if (obj.cell.type === CellTypes.DESTINATION) {
            found = true;
            destination = obj;
          }
          queue.push(obj);
          searchedCells.push(obj);
          loadDocumentObjectByID(obj.cell.id).classList.add(styles.searchCell);
          // Assign cell new class and update properties
          cells[obj.cell.id].type = CellTypes.SEARCH;
          cells[obj.cell.id].distance = startCell.cell.distance + 1;
        });

        // Remove current cell from queue
        queue.splice(queue.indexOf(startCell), 1);
      };

      /*
        Function iterates from destination node using 
        the parent attribute to generate the full path
      */
      const generatePath = () => {
        path.push(destination);
        while (path.slice(-1)[0].parent.type !== CellTypes.INITIAL) {
          let parent = path.slice(-1)[0].parent;
          path.push(
            searchedCells.filter((obj) => obj.cell.id === parent.id)[0]
          );
        }
      };

      /*
        Function takes each cell in path and assigns it colour
      */
      const colourPath = () => {
        path.reverse();
        path.map((obj, idx) => {
          // setTimeout for visual effect
          setTimeout(() => {
            // The last cell is the destination cell; apply correct colouring
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
          }, 40 * idx);
        });
      };

      /*
        Using setInterval to iterate through the search at 25ms intervals.
      */
      let searchLoop = setInterval(() => {
        if (!found && search) {
          try {
            addAdjacentCells(queue[0]);
          } catch (e) {
            search = false;
          }
        }

        if (found && search) {
          clearInterval(searchLoop);
          generatePath();
          colourPath();
        }
      }, 10);
    },
    /*
      Function is used to stop the solve function
    */
    stopSolve() {
      cells = [];
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
