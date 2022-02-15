import styles from "../styles/GridSizeModal.module.css";
import { useState } from "react";

const GridSizeModal = ({
  toggleFunction,
  callbackFunction,
  initialHeight,
  initialWidth,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);

  const [error, setError] = useState(false);

  const isInt = (value) => {
    return (
      !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10))
    );
  };

  const handleSubmit = () => {
    setWidth((prev) => parseInt(prev));
    setHeight((prev) => parseInt(prev));

    if (!isInt(width) || !isInt(height)) {
      setError(true);
    } else {
      if (width > 5 && height > 5 && width <= 50 && height <= 50) {
        setError(false);
        callbackFunction(width, height);
        toggleFunction();
      }
    }
  };

  return (
    <section
      id={"background"}
      className={styles.modalBackground}
      onClick={(event) => {
        if (event.target.id === "background") {
          toggleFunction();
        }
      }}
    >
      <div className={styles.modalBody}>
        <h1 className={styles.modalTitle}>Set Grid Dimensions</h1>

        <form action="">
          {error ? <p>Error: </p> : <></>}
          <div className={styles.flexRow}>
            <input
              type="number"
              className={styles.sizeInput}
              defaultValue={initialWidth}
              placeholder={initialWidth}
              min={5}
              max={50}
              step={1}
              pattern="\d+"
              onChange={(event) => setWidth(event.target.value)}
            />
            <span className={styles.bySign}>x</span>
            <input
              type="number"
              className={styles.sizeInput}
              defaultValue={initialHeight}
              placeholder={initialHeight}
              min={5}
              max={50}
              step={1}
              pattern="\d+"
              onChange={(event) => setHeight(event.target.value)}
            />
          </div>

          <input
            type="submit"
            className={styles.submitButton}
            value="Update"
            onClick={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          />
        </form>
      </div>
    </section>
  );
};

export default GridSizeModal;
