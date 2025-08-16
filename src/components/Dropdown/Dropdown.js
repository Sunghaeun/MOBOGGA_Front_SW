import React, { use, useRef, useStates } from "react";
import styles from "./Dropdown.module.css";
import useDetectClose from "./utils/hooks/useDetectClose";

function Dropdown() {
  const dropDownRef = useRef();
  const [value, setValue] = useStates("");

  const [isOpen, setIsOpen] = useDetectClose(dropDownRef);

  return (
    <div
      ref={dropDownRef}
      className={styles.selectBox}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      {value}
      {isOpen && (
        <ul className={styles.optionList}>
          <li
            data-content="선택지 1"
            className={styles.optionItem}
            onClick={(e) => {
              setValue(e.target.dataset["content"]);
            }}
          >
            선택지 1
          </li>
          <li
            data-content="선택지 2"
            className={styles.optionItem}
            onClick={(e) => {
              setValue(e.target.dataset["content"]);
            }}
          >
            선택지 2
          </li>
          <li
            data-content="선택지 3"
            className={styles.optionItem}
            onClick={(e) => {
              setValue(e.target.dataset["content"]);
            }}
          >
            선택지 3
          </li>
          <li
            data-content="선택지 4"
            className={styles.optionItem}
            onClick={(e) => {
              setValue(e.target.dataset["content"]);
            }}
          >
            선택지 4
          </li>
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
